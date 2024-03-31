import {
  Button,
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
import { Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { getAppInfo, getUserList, saveConfig, setMod } from "../../logic/config";
import { useEffect, useRef, useState } from "react";
import Map from "../../components/map/Map";
import "./config.css";

function MapConfig({ appInfo }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const editControlRef = useRef();
  let _lastDrawn = null;

  function onClickDraw() {
    if (!editControlRef.current || isDrawing) {
      return;
    }
    editControlRef.current._toolbars.draw._modes.polygon.handler.enable();
    setIsDrawing(true);
  }

  function onClickSaveMap() {
    if (!editControlRef.current || !isDrawing) {
      return;
    }
    editControlRef.current._toolbars.draw._modes.polygon.handler.completeShape();
    editControlRef.current._toolbars.draw._modes.polygon.handler.disable();
    setIsDrawing(false);
  }

  function onClickCancel() {
    if (!editControlRef.current || !isDrawing) {
      return;
    }
    editControlRef.current._toolbars.draw._modes.polygon.handler.disable();
    setIsDrawing(false);
  }

  function onDrawn(e) {
    if (_lastDrawn) {
      e.sourceTarget._layers[_lastDrawn._leaflet_id].remove();
    }
    let lastDrawn = e.layer;

    let points = [];
    for (let latlng of lastDrawn._latlngs[0]) {
      points.push([latlng.lat, latlng.lng]);
    }
    saveConfig(points, function () {
      console.log("ok");
    });
  }

  return (
    <div>
      <div className="title">Límites</div>
      <p>Son los límites de la zona de uso de la aplicación.</p>
      {appInfo ? (
        <Map
          limits={appInfo.points}
          editControlRef={editControlRef}
          className={"configMap"}
          onDrawn={onDrawn}
          drawLatLngs={appInfo.points}
        />
      ) : null}
      <div>
        <Button disabled={isDrawing} onClick={onClickDraw}>
          Dibujar
        </Button>
        <Button disabled={!isDrawing} onClick={onClickSaveMap}>
          Guardar
        </Button>
        <Button disabled={!isDrawing} onClick={onClickCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}

function UsersConfig() {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    setUserList(prevUsers => {
      return prevUsers.map(user => {
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

  const filteredUsers = userList.filter(user => {
    return user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.username.toLowerCase().includes(searchTerm.toLowerCase());
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

function Config() {
  const [appInfo, setAppInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAppInfo((appInfo) => {
      if (!appInfo["user"] || !appInfo["user"]["is_admin"]) {
        navigate("/login");
      }
      setAppInfo(appInfo);
    });
  }, []);

  return (
    <div className="configContainer">
      <MapConfig appInfo={appInfo} />
      <UsersConfig />
    </div>
  );
}

export default Config;
