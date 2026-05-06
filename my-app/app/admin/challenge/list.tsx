import { Datagrid, List, TextField, ReferenceField, NumberField, SelectField } from "react-admin";

const CHALLENGE_TYPES = [
  { id: "SELECT", name: "SELECT" },
  { id: "ASSIST", name: "ASSIST" },
  { id: "WORD_BANK", name: "WORD_BANK" },
  { id: "FILL_BLANK", name: "FILL_BLANK" },
  { id: "TRANSLATE", name: "TRANSLATE" },
  { id: "MATCH", name: "MATCH" },
  { id: "LISTEN", name: "LISTEN" },
];

export const ChallengeList = () => {
  return (
    <List sort={{ field: "id", order: "ASC" }} perPage={25}>
      <Datagrid rowClick="edit">
        <NumberField source="id" label="ID" />
        <TextField source="question" label="Question" />
        <SelectField source="type" choices={CHALLENGE_TYPES} label="Type" />
        <ReferenceField source="lessonId" reference="lessons" label="Leçon" />
        <NumberField source="order" label="Order" />
      </Datagrid>
    </List>
  );
};