import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { addClass, removeClass } from "../../logic/config";

function ClassesConfig({classes}) {
  const [className, setClassName] = useState("");
  const [iconURL, setIconURL] = useState("");
  const [cls, setClasses] = useState(classes);

  let classesElements = [];
  for (let cl of Object.values(cls)) {
    function _removeClass() {
      removeClass(cl.id, () => {
        setClasses(Object.values(cls).filter((c) => c.id !== cl.id));
      });
    }

    classesElements.push(
      <TableRow key={cl.id}>
        <TableCell>{cl.classname}</TableCell>
        <TableCell>{cl.iconurl}</TableCell>
        <TableCell onClick={_removeClass}>borrar</TableCell>
      </TableRow>
    )
  }

  function onClickAddClass() {
    addClass(className, iconURL, (data) => {
      let new_class = {'classname': className, 'iconurl': iconURL, 'id': data.id}
      setClasses([...Object.values(cls), new_class]);
      setClassName("");
      setIconURL("");
    });
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Clase</TableCell>
          <TableCell>URL icono</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow key={-1}>
          <TableCell>
            <TextField
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </TableCell>
          <TableCell>
            <TextField
              value={iconURL}
              onChange={(e) => setIconURL(e.target.value)}
            />
          </TableCell>
          <TableCell>
            <Button onClick={onClickAddClass}>Añadir</Button>
          </TableCell>
        </TableRow>
        {classesElements}
      </TableBody>
    </Table>
  );
}

export default ClassesConfig;
