import { Datagrid, List, TextField, ImageField } from "react-admin";

export const CourseList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <ImageField source="imageSrc" />
      </Datagrid>
    </List>
  );
};