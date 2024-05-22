import { useState } from "react";
import { addComment, removeComment } from "../../logic/incidence";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  TextField,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

function Comment({ comment, onClickRemoveComment, appInfo }) {
  return (
    <div style={{ margin: "15px 0" }} key={comment["id"]}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "25px",
        }}
      >
        <div style={{ fontWeight: "bold" }}>{comment["user"]}</div>
        {appInfo["user"] &&
          (appInfo["user"]["is_admin"] || appInfo["user"]["is_mod"]) && (
            <DeleteOutlineIcon
              style={{ cursor: "pointer", fontSize: "1.25em" }}
              onClick={() => onClickRemoveComment(comment["id"])}
            />
          )}
      </div>

      <div
        style={{
          paddingLeft: "20px",
          maxWidth: "80%",
          textOverflow: "ellipsis",
          whiteSpace: "initial",
          wordWrap: "break-word",
        }}
      >
        {comment["text"]}
      </div>
    </div>
  );
}

function CommentsContainer({ comments, setComments, appInfo }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [removeCommentId, setRemoveCommentId] = useState(null);
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  const count = parseInt(comments.length / 10) + 1;
  function onChangePage(e, v) {
    setPage(v);
  }

  function onClickRemoveComment(commentid) {
    setRemoveCommentId(commentid);
    setOpenDialog(true);
  }

  function handleDialogClose() {
    setOpenDialog(false);
  }

  function handleConfirmClose() {
    try {
      removeComment(removeCommentId, () => {
        const updatedComments = comments.filter(
          (comment) => comment.id !== removeCommentId
        );
        setComments(updatedComments);
        setRemoveCommentId(null);
        setOpenDialog(false);
      });
    } catch (e) {
      console.log(e);
      setOpenDialog(false);
    }
  }

  let commentsElements = [];
  for (
    let i = (page - 1) * 10;
    i < (page - 1) * 10 + 10 && i < comments.length;
    i++
  ) {
    let comment = comments[i];
    commentsElements.push(
      <Comment
        comment={comment}
        appInfo={appInfo}
        onClickRemoveComment={() => {
          onClickRemoveComment(comment["id"]);
        }}
        key={comment["id"]}
      />
    );
  }
  return (
    <div>
      <div style={{ margin: "10px 0" }}>{commentsElements}</div>
      {count > 1 && (
        <Pagination page={page} onChange={onChangePage} count={count} />
      )}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{t("remove_comment")}</DialogTitle>
        <DialogContent>{t("remove_comment_confirmation")}</DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {t("cancel")}
          </Button>
          <Button onClick={handleConfirmClose} color="primary" autoFocus>
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Comments({ incidence, appInfo }) {
  const [value, setValue] = useState("");
  const [comments, setComments] = useState(incidence["comments"] || []);
  const navigate = useNavigate();

  function onKeyUp(e) {
    if (e.key === "Enter") {
      if (!appInfo["logged"]) {
        navigate("/login");
        return;
      }
      addComment(incidence["id"], value, (data) => {
        setComments([
          {
            text: value,
            user: appInfo["user"]["username"],
            id: data["commentid"],
          },
          ...comments,
        ]);
      });
      setValue("");
    }
  }

  return (
    <>
      {appInfo && appInfo["config"]["can_comment"] && (
        <TextField
          style={{ maxWidth: "800px" }}
          onKeyUp={onKeyUp}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
      <CommentsContainer
        comments={comments}
        setComments={setComments}
        appInfo={appInfo}
      />
    </>
  );
}

export default Comments;
