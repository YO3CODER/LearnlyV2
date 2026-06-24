"use client";

import { useState, useEffect, useMemo } from "react";
import { Check, Send, RotateCcw, Zap, Crown, Target, Search, Users, X } from "lucide-react";
import Image from "next/image";

const TEMPLATES = [
  {
    id: "daily",
    label: "Rappel du jour",
    title: "Rappel du jour",
    message: "Tu n'as pas encore fait ta leçon aujourd'hui !",
    image: "/quete3.svg",
  },
  {
    id: "new-lesson",
    label: "Nouvelle leçon",
    title: "Nouvelle leçon disponible",
    message: "Une nouvelle leçon t'attend sur Learnly. Apprends dès maintenant !",
    image: "/courses.svg",
  },
  {
    id: "streak-danger",
    label: "Serie en danger",
    title: "Ta serie est en danger",
    message: "Tu risques de perdre ta serie. Fais une leçon maintenant pour la conserver !",
    image: "/mascot.svg",
  },
];

type User = {
  userId: string;
  userName: string;
  userImageSrc: string;
};

export default function PushAdminPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Users
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .catch(console.error)
      .finally(() => setUsersLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter((u) => u.userName.toLowerCase().includes(q));
  }, [users, search]);

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedUserIds.size === users.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(users.map((u) => u.userId)));
    }
  };

  const clearSelection = () => setSelectedUserIds(new Set());

  const send = async () => {
    if (!title || !message) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          userIds: selectedUserIds.size > 0 ? Array.from(selectedUserIds) : [],
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTitle("");
    setMessage("");
    setResult(null);
    setSelectedTemplate(null);
    setSelectedUserIds(new Set());
    setSearch("");
  };

  const selectTemplate = (template: typeof TEMPLATES[0]) => {
    setTitle(template.title);
    setMessage(template.message);
    setResult(null);
    setSelectedTemplate(template.id);
  };

  const charCount = message.length;
  const charLimit = 150;
  const charPercentage = Math.min((charCount / charLimit) * 100, 100);
  const allSelected = users.length > 0 && selectedUserIds.size === users.length;
  const isBroadcast = selectedUserIds.size === 0;

  return (
    <div className="min-h-screen font-sans" style={{ background: "#f9fafb" }}>
      {/* NAVBAR */}
      <nav style={{
        background: "#fff",
        borderBottom: "3px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 64
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/mascot.svg" alt="Mascot" width={38} height={38} />
            <span style={{ fontSize: 22, fontWeight: 900, color: "#4db6f5", letterSpacing: -0.5 }}>Learnly</span>
          </div>
          <a href="https://learnlyv2.yosite.fun/" className="btn-bounce" style={{
            background: "#4db6f5", color: "#fff", fontWeight: 900, fontSize: 14,
            padding: "11px 20px", borderRadius: 12, border: "none", cursor: "pointer",
            textDecoration: "none", letterSpacing: 0.5, textTransform: "uppercase",
            boxShadow: "0 4px 0 #2193d3", whiteSpace: "nowrap",
          }}>
            Commencer
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14,
              background: "linear-gradient(135deg, #4db6f5, #2193d3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 0 #1a7bb8"
            }}>
              <svg fill="none" stroke="white" viewBox="0 0 24 24" width={28} height={28}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a1a1a", margin: 0, letterSpacing: -0.5 }}>
                Notifications
              </h1>
              <p style={{ color: "#6b7280", fontSize: 15, margin: "4px 0 0" }}>
                Envoie des notifications à tes utilisateurs
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}>
            {[
              { label: "Statut", value: "Actif", color: "#4caf50" },
              { label: "Caracteres", value: `${charCount}/${charLimit}`, color: "#4db6f5" },
              {
                label: "Cible",
                value: isBroadcast ? "Tous" : `${selectedUserIds.size} user(s)`,
                color: "#9c27b0"
              },
            ].map((s) => (
              <div key={s.label} style={{
                background: "#fff", borderRadius: 16, border: "2px solid #e5e7eb", padding: "16px 20px"
              }}>
                <p style={{ fontSize: 11, fontWeight: 900, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>{s.label}</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: s.color, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 13, fontWeight: 900, color: "#9ca3af", textTransform: "uppercase",
            letterSpacing: 2, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8
          }}>
            <Zap size={16} style={{ color: "#f59e0b" }} />
            Modeles rapides
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => selectTemplate(template)}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                style={{
                  position: "relative", overflow: "hidden", borderRadius: 16,
                  border: `2px solid ${selectedTemplate === template.id ? "#4db6f5" : "#e5e7eb"}`,
                  background: "#fff", cursor: "pointer", textAlign: "left", padding: 0,
                  transition: "all 0.3s ease",
                  boxShadow: selectedTemplate === template.id ? "0 4px 0 #2193d3" : "none",
                  transform: hoveredTemplate === template.id ? "translateY(-2px)" : "none",
                }}
              >
                <div style={{ padding: "20px 20px 18px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <Image src={template.image} alt={template.label} width={48} height={48} style={{ opacity: 0.8 }} />
                    {selectedTemplate === template.id && (
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%", background: "#4caf50",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        <Check size={14} color="white" />
                      </div>
                    )}
                  </div>
                  <h3 style={{ fontWeight: 900, fontSize: 15, color: "#1a1a1a", margin: "0 0 4px" }}>{template.label}</h3>
                  <p style={{ color: "#6b7280", fontSize: 13, margin: 0, lineHeight: 1.4 }}>{template.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire + Destinataires côte à côte */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>

          {/* Formulaire */}
          <div style={{ background: "#fff", borderRadius: 20, border: "2px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "32px" }}>

              {/* Titre */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  fontSize: 11, fontWeight: 900, color: "#9ca3af", textTransform: "uppercase",
                  letterSpacing: 1, display: "flex", alignItems: "center", gap: 8, marginBottom: 8
                }}>
                  <Target size={14} /> Titre
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Rappel du jour"
                    maxLength={60}
                    style={{
                      width: "100%", padding: "14px 60px 14px 20px", borderRadius: 12,
                      border: "2px solid #e5e7eb", background: "#f9fafb", fontSize: 15,
                      fontWeight: 600, color: "#1a1a1a", outline: "none", boxSizing: "border-box",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#4db6f5"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                  <span style={{
                    position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                    fontSize: 12, fontWeight: 700, color: "#9ca3af"
                  }}>{title.length}/60</span>
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  fontSize: 11, fontWeight: 900, color: "#9ca3af", textTransform: "uppercase",
                  letterSpacing: 1, display: "flex", alignItems: "center", gap: 8, marginBottom: 8
                }}>
                  <Crown size={14} /> Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ex: Tu n'as pas encore fait ta lecon aujourd'hui !"
                  rows={4}
                  maxLength={charLimit}
                  style={{
                    width: "100%", padding: "14px 20px", borderRadius: 12,
                    border: "2px solid #e5e7eb", background: "#f9fafb", fontSize: 15,
                    fontWeight: 600, color: "#1a1a1a", outline: "none", resize: "none",
                    fontFamily: "inherit", boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#4db6f5"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
                <div style={{ width: "100%", height: 6, background: "#e5e7eb", borderRadius: 4, overflow: "hidden", marginTop: 12 }}>
                  <div style={{
                    height: "100%", borderRadius: 4, width: `${charPercentage}%`,
                    background: charPercentage > 90
                      ? "linear-gradient(to right, #fb7185, #f43f5e)"
                      : charPercentage > 70
                      ? "linear-gradient(to right, #fbbf24, #f59e0b)"
                      : "linear-gradient(to right, #4caf50, #2e7d32)",
                    transition: "width 0.2s ease"
                  }} />
                </div>
                <p style={{ textAlign: "right", fontSize: 12, color: "#9ca3af", fontWeight: 600, margin: "6px 0 0" }}>
                  {charLimit - charCount} caracteres restants
                </p>
              </div>

              {/* Apercu */}
              {(title || message) && (
                <div style={{
                  borderRadius: 16, border: "2px solid #e5e7eb", background: "#f9fafb",
                  padding: "20px", display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: "linear-gradient(135deg, #4db6f5, #2193d3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 0 #1a7bb8"
                  }}>
                    <svg fill="none" stroke="white" viewBox="0 0 24 24" width={20} height={20}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, fontSize: 14, color: "#1a1a1a", margin: "0 0 4px" }}>
                      {title || "Titre de la notification"}
                    </p>
                    <p style={{ color: "#6b7280", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                      {message || "Contenu du message..."}
                    </p>
                    <p style={{ color: "#9ca3af", fontSize: 12, margin: "8px 0 0" }}>Learnly · a l'instant</p>
                  </div>
                </div>
              )}

              {/* Resultat */}
              {result && (
                <div style={{
                  borderRadius: 16,
                  border: `2px solid ${result.failed === 0 ? "#4caf50" : "#f59e0b"}`,
                  background: result.failed === 0 ? "#f0fdf4" : "#fffbeb",
                  padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 24
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: result.failed === 0 ? "#4caf50" : "#f59e0b",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Check size={20} color="white" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 14, color: result.failed === 0 ? "#15803d" : "#b45309", margin: "0 0 2px" }}>
                      {result.success} notification{result.success > 1 ? "s" : ""} envoyee{result.success > 1 ? "s" : ""} avec succes
                    </p>
                    {result.failed > 0 && (
                      <p style={{ fontSize: 13, color: "#b45309", margin: 0 }}>
                        {result.failed} echouee{result.failed > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Boutons */}
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={reset}
                  disabled={loading}
                  style={{
                    padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 800,
                    border: "2px solid #e5e7eb", background: "#fff", color: "#6b7280",
                    cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center",
                    gap: 8, opacity: loading ? 0.5 : 1
                  }}
                >
                  <RotateCcw size={16} /> Reinitialiser
                </button>
                <button
                  onClick={send}
                  disabled={loading || !title || !message}
                  style={{
                    flex: 1, padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 800,
                    border: "none", background: "linear-gradient(135deg, #4db6f5, #2193d3)", color: "#fff",
                    cursor: (loading || !title || !message) ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: "0 4px 0 #1a7bb8", opacity: (loading || !title || !message) ? 0.5 : 1,
                  }}
                  onMouseDown={(e) => {
                    if (!loading && title && message) {
                      e.currentTarget.style.transform = "translateY(4px)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 0 #1a7bb8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 0 #1a7bb8";
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" fill="none" viewBox="0 0 24 24" width={16} height={16}>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {isBroadcast
                        ? "Envoyer à tous"
                        : `Envoyer à ${selectedUserIds.size} utilisateur${selectedUserIds.size > 1 ? "s" : ""}`}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Panel destinataires */}
          <div style={{ background: "#fff", borderRadius: 20, border: "2px solid #e5e7eb", overflow: "hidden" }}>
            {/* Header panel */}
            <div style={{ padding: "20px 20px 0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Users size={16} style={{ color: "#4db6f5" }} />
                  <span style={{ fontSize: 13, fontWeight: 900, color: "#1a1a1a" }}>
                    Destinataires
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={toggleAll}
                    style={{
                      fontSize: 11, fontWeight: 800, padding: "5px 10px", borderRadius: 8,
                      border: "2px solid #e5e7eb", background: "#f9fafb", color: "#6b7280",
                      cursor: "pointer"
                    }}
                  >
                    {allSelected ? "Aucun" : "Tous"}
                  </button>
                  {selectedUserIds.size > 0 && (
                    <button
                      onClick={clearSelection}
                      style={{
                        fontSize: 11, fontWeight: 800, padding: "5px 10px", borderRadius: 8,
                        border: "2px solid #fee2e2", background: "#fef2f2", color: "#ef4444",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                      }}
                    >
                      <X size={11} /> Vider
                    </button>
                  )}
                </div>
              </div>

              {/* Badge broadcast */}
              <div style={{
                borderRadius: 10, padding: "8px 12px", marginBottom: 12,
                background: isBroadcast ? "#f0fdf4" : "#eff6ff",
                border: `2px solid ${isBroadcast ? "#bbf7d0" : "#bfdbfe"}`,
                fontSize: 12, fontWeight: 700,
                color: isBroadcast ? "#15803d" : "#1d4ed8",
              }}>
                {isBroadcast
                  ? "Broadcast — tous les abonnés recevront la notification"
                  : `${selectedUserIds.size} utilisateur${selectedUserIds.size > 1 ? "s" : ""} sélectionné${selectedUserIds.size > 1 ? "s" : ""}`}
              </div>

              {/* Recherche */}
              <div style={{ position: "relative", marginBottom: 12 }}>
                <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filtrer par nom..."
                  style={{
                    width: "100%", padding: "10px 12px 10px 34px", borderRadius: 10,
                    border: "2px solid #e5e7eb", background: "#f9fafb", fontSize: 13,
                    fontWeight: 600, color: "#1a1a1a", outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#4db6f5"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            </div>

            {/* Liste */}
            <div style={{ maxHeight: 420, overflowY: "auto", padding: "0 20px 20px" }}>
              {usersLoading ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>
                  Chargement...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>
                  Aucun utilisateur trouvé
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const selected = selectedUserIds.has(user.userId);
                  return (
                    <button
                      key={user.userId}
                      onClick={() => toggleUser(user.userId)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 12px", borderRadius: 12, marginBottom: 6,
                        border: `2px solid ${selected ? "#4db6f5" : "#e5e7eb"}`,
                        background: selected ? "#eff6ff" : "#f9fafb",
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      }}
                    >
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <img
                          src={user.userImageSrc}
                          alt={user.userName}
                          width={36}
                          height={36}
                          style={{ borderRadius: "50%", objectFit: "cover", display: "block" }}
                          onError={(e) => { (e.target as HTMLImageElement).src = "/default-avatar.png"; }}
                        />
                        {selected && (
                          <div style={{
                            position: "absolute", bottom: -2, right: -2,
                            width: 14, height: 14, borderRadius: "50%",
                            background: "#4db6f5", border: "2px solid #fff",
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            <Check size={8} color="white" />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 800, fontSize: 13, color: "#1a1a1a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {user.userName}
                        </p>
                        <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {user.userId}
                        </p>
                      </div>
                      <div style={{
                        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                        border: `2px solid ${selected ? "#4db6f5" : "#d1d5db"}`,
                        background: selected ? "#4db6f5" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        {selected && <Check size={12} color="white" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <p style={{ color: "#9ca3af", fontSize: 13 }}>
            Conseil : Les notifications courtes et pertinentes ont un taux d'engagement plus eleve
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .btn-bounce { transition: all 0.2s ease; }
        .btn-bounce:hover { transform: translateY(-2px); box-shadow: 0 6px 0 #2193d3 !important; }
        .btn-bounce:active { transform: translateY(4px); box-shadow: none !important; }
      `}</style>
    </div>
  );
}