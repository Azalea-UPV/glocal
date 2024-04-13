import {
  Checkbox,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import { getUserList, setMod } from "../../logic/config";

function UsersConfig() {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false); // Nuevo estado para manejar el estado de carga
  const rowsPerPage = 10;

  useEffect(() => {
    getUserList((data) => {
      setUserList(data["users"] || []);
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCheckboxChange = (userId) => {
    setLoading(true); // Establecer el estado de carga a verdadero mientras se realiza el cambio
    setUserList((prevUsers) => {
      return prevUsers.map((user) => {
        if (user.id === userId) {
          setMod(userId, !user.is_mod, () => {
            setLoading(false); // Restablecer el estado de carga a falso después de que se complete el cambio
          });
          return { ...user, is_mod: !user.is_mod };
        }
        return user;
      });
    });
  };

  const filteredUsers = userList.filter((user) => {
    return (
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const usersElements = filteredUsers
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((user, index) => (
      <TableRow key={index}>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>
          <Checkbox
            checked={user.is_mod || user.is_admin}
            disabled={loading} // Deshabilitar el checkbox mientras se carga
            onChange={() => handleCheckboxChange(user.id)}
          />
        </TableCell>
      </TableRow>
    ));

  return (
    <>
      <div>USUARIOS</div>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>mail</TableCell>
            <TableCell>nombre de usuario</TableCell>
            <TableCell>mod</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{usersElements}</TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={rowsPerPage}
      />
    </>
  );
}

export default UsersConfig;