import { useEffect, useState } from "react";
import Marker from "../marker/Marker";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import LinkIcon from "@mui/icons-material/Link";
import CheckIcon from "@mui/icons-material/Check";
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SwipeableDrawer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { closeIncidence, do_like } from "../../logic/incidence";
import Comments from "../comments/Comments";
import { AnimatePresence, motion } from "framer-motion";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

function LikeButton({ liked, numLikes, onClick }) {
  numLikes = numLikes || 0;

  return (
    <Badge
      badgeContent={numLikes > 0 ? numLikes : null}
      style={{ cursor: "pointer" }}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }} // Escala y rotación al pasar el mouse
        whileTap={{ scale: 0.8 }} // Escala del ícono al hacer clic
        transition={{ type: "spring", stiffness: 400 }} // Transición suave al hacer clic
        onClick={onClick}
      >
        {liked ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ display: "inline-block" }}
          >
            <FavoriteIcon style={{ color: "red" }} />
          </motion.div>
        ) : (
          <FavoriteBorderIcon />
        )}
      </motion.div>
    </Badge>
  );
}

function ShareButton({ incidence }) {
  const { t } = useTranslation();

  function onClick() {
    const shareData = {
      title: incidence["short_description"],
      text: t("share_text"),
      url: `/incidence/${incidence["id"]}`,
    };
    try {
      navigator["share"](shareData);
    } catch (error) {
      console.log(error);
    }
  }

  return <ShareIcon onClick={onClick} style={{ cursor: "pointer" }} />;
}

function CopyLinkButton({ incidence }) {
  const [copied, setCopied] = useState(false);

  function onClick() {
    navigator.clipboard.writeText(
      `${window.location.host}/incidence/${incidence["id"]}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 3 * 1000);
  }

  return (
    <AnimatePresence mode="wait">
      {(!copied && (
        <motion.div
          exit={{ rotate: 360 }}
          transition={{ duration: 0.2 }}
          key={copied}
        >
          <LinkIcon
            onClick={onClick}
            style={{ rotate: "-45deg", cursor: "pointer" }}
          />
        </motion.div>
      )) || (
        <motion.div
          exit={{ rotate: 360 }}
          transition={{ duration: 0.2 }}
          key={copied}
        >
          <CheckIcon />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CloseIncidenceButton({ incidence, onCloseIncidence }) {
  const [openDialog, setOpenDialog] = useState(false);
  const { t } = useTranslation();

  function onClickCloseIncidence() {
    setOpenDialog(true);
  }

  function handleDialogClose() {
    setOpenDialog(false);
  }

  function handleConfirmClose() {
    closeIncidence(incidence["id"], () => {
      onCloseIncidence();
    });
    setOpenDialog(false);
  }

  return (
    <>
      <CloseIcon
        onClick={onClickCloseIncidence}
        style={{ cursor: "pointer" }}
      />
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{t("close_incidence")}</DialogTitle>
        <DialogContent>{t("close_incidence_confirmation")}</DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {t("cancel")}
          </Button>
          <Button onClick={handleConfirmClose} color="primary" autoFocus>
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function SheetContent({ incidence, appInfo, onCloseIncidence }) {
  const [liked, setLiked] = useState(incidence["liked"] || false);
  const navigate = useNavigate();

  function onClickLike() {
    if (!appInfo["user"]) {
      navigate("/login");
      return;
    }
    do_like(incidence["id"], !liked);
    incidence["likes"] += !liked ? 1 : -1;
    setLiked(!liked);
  }

  return (
    <div
      style={{
        minWidth: "80vw",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "start",
        gap: "50px",
        maxHeight: "80vh",
      }}
    >
      <div style={{ maxWidth: "75px" }}>
        {MarkerIcon(appInfo, incidence)}
        {incidence["class"] &&
          appInfo["classes"] &&
          appInfo["classes"][incidence["class"]] &&
          appInfo["classes"][incidence["class"]]["classname"] && (
            <div style={{ fontSize: "0.8em", textAlign: 'center', fontWeight: 'bold' }}>{appInfo["classes"][incidence["class"]]["classname"]}</div>
          )}
        <div style={{ fontSize: "0.75em", color: "gray", margin: '5px 0' }}>
          {incidence.address}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          gap: "10px",
          width: "60%",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1.5em" }}>
          {incidence["short_description"]}
        </div>
        <div>{incidence["long_description"]}</div>
        <div
          style={{
            marginTop: "20px",
            gap: "10px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <LikeButton
            onClick={onClickLike}
            numLikes={incidence["likes"]}
            liked={liked}
          />
          {(navigator["share"] && <ShareButton incidence={incidence} />) || (
            <CopyLinkButton incidence={incidence} />
          )}
          {appInfo["user"] &&
            (appInfo["user"]["is_mod"] || appInfo["user"]["is_admin"]) && (
              <CloseIncidenceButton
                incidence={incidence}
                onCloseIncidence={onCloseIncidence}
              />
            )}
        </div>
        <Comments incidence={incidence} appInfo={appInfo} />
      </div>
    </div>
  );
}

function MarkerIcon(appInfo, incidence) {
  if (
    !appInfo ||
    !appInfo["classes"] ||
    !incidence ||
    !appInfo["classes"][incidence["class"]] ||
    !appInfo["classes"][incidence["class"]]["iconurl"] ||
    !appInfo["classes"][incidence["class"]]["iconurl"].trim()
  ) {
    return <Marker size={75} />;
  }

  let iconUrl = appInfo["classes"][incidence["class"]]["iconurl"];
  return <img src={iconUrl} style={{ width: "75px" }} />;
}

function BottomSheet({ incidence, appInfo, onCloseIncidence }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(incidence != null);
  }, [incidence]);

  return (
    <SwipeableDrawer
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      anchor="bottom"
      SwipeAreaProps={{ edge: "bottom" }}
      ModalProps={{
        keepMounted: false,
      }}
    >
      {incidence && (
        <>
          <div style={{ width: "100%", height: "50px" }}>
            <div
              style={{
                width: "75px",
                backgroundColor: "gray",
                borderRadius: "25px",
                height: "7px",
                margin: "10px auto",
              }}
            />
          </div>
          <SheetContent
            incidence={incidence}
            appInfo={appInfo}
            onCloseIncidence={onCloseIncidence}
          />
        </>
      )}
    </SwipeableDrawer>
  );
}

export default BottomSheet;
