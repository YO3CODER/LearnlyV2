"use client";

import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import { defaultTheme } from "react-admin";

// Icônes
import BookIcon from "@mui/icons-material/Book";
import LayersIcon from "@mui/icons-material/Layers";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { CourseList } from "./course/list";
import { CourseEdit } from "./course/edit";
import { CourseCreate } from "./course/create";

import { UnitList } from "./unit/list";
import { UnitEdit } from "./unit/edit";
import { UnitCreate } from "./unit/create";

import { LessonList } from "./lesson/list";
import { LessonEdit } from "./lesson/edit";
import { LessonCreate } from "./lesson/create";

import { ChallengeList } from "./challenge/list";
import { ChallengeEdit } from "./challenge/edit";
import { ChallengeCreate } from "./challenge/create";

import { ChallengeOptionList } from "./challengeOption/list";
import { ChallengeOptionEdit } from "./challengeOption/edit";
import { ChallengeOptionCreate } from "./challengeOption/create";

const dataProvider = simpleRestProvider("/api");

const theme = {
  ...defaultTheme,
  palette: {
    primary: {
      main: "#4F46E5", // indigo
      light: "#818CF8",
      dark: "#3730A3",
    },
    secondary: {
      main: "#10B981", // vert
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h6: {
      fontWeight: 700,
    },
  },
  components: {
    ...defaultTheme.components,
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          margin: "2px 8px",
          "&.RaMenuItemLink-active": {
            backgroundColor: "#EEF2FF",
            color: "#4F46E5",
            fontWeight: 700,
          },
        },
      },
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          "& .RaDatagrid-headerCell": {
            backgroundColor: "#F3F4F6",
            fontWeight: 700,
            color: "#374151",
          },
          "& .RaDatagrid-row:hover": {
            backgroundColor: "#EEF2FF",
          },
        },
      },
    },
  },
};

const App = () => {
  return (
    <Admin
      dataProvider={dataProvider}
      theme={theme}
      title="Learnly Admin"
    >
      <Resource
        name="courses"
        list={CourseList}
        create={CourseCreate}
        edit={CourseEdit}
        recordRepresentation="title"
        icon={BookIcon}
        options={{ label: "Cours" }}
      />
      <Resource
        name="units"
        list={UnitList}
        create={UnitCreate}
        edit={UnitEdit}
        recordRepresentation="title"
        icon={LayersIcon}
        options={{ label: "Unités" }}
      />
      <Resource
        name="lessons"
        list={LessonList}
        create={LessonCreate}
        edit={LessonEdit}
        recordRepresentation="title"
        icon={SchoolIcon}
        options={{ label: "Leçons" }}
      />
      <Resource
        name="challenges"
        list={ChallengeList}
        create={ChallengeCreate}
        edit={ChallengeEdit}
        recordRepresentation="question"
        icon={QuizIcon}
        options={{ label: "Défis" }}
      />
      <Resource
        name="challengeOptions"
        list={ChallengeOptionList}
        create={ChallengeOptionCreate}
        edit={ChallengeOptionEdit}
        recordRepresentation="text"
        icon={CheckCircleIcon}
        options={{ label: "Options de défi" }}
      />
    </Admin>
  );
};

export default App;