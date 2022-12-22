import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

import Encryption from "../helpers/encryption";
import Http from "../helpers/http";

import UserLine from "./UserLine";
import UserEditor from "./UserEditor";
import UserLoader from "./UserLoader";

const initial = { name: "", city: "", phone: "", email: "" };

export default function UsersManager() {
  const [loader, setLoader] = useState({ show: false, message: "Loading..." });
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(initial);
  const [editorState, setEditorState] = useState(false);
  const [keysPairLoaded, setKeysPairLoaded] = useState(false);
  const [encryption, setEncryption] = useState(new Encryption());

  useEffect(() => {
    if (!localStorage.getItem("device_uuid")) {
      const deviceUuid = uuidv4();
      localStorage.setItem("device_uuid", deviceUuid);
    }

    const stored = encryption.getKeysFromStore();

    if (
      stored.publicKey &&
      stored.privateKey &&
      encryption.verify(stored.publicKey, stored.privateKey)
    ) {
      const keypair = encryption.keyPairFromPem(
        stored.publicKey,
        stored.privateKey
      );

      setEncryption((ect) => {
        ect.keypair = keypair;
        return ect;
      });
      setKeysPairLoaded(true);
    } else {
      encryption.generate().then((keypair) => {
        encryption.storeKeyPairToPem(keypair);
        setEncryption((ect) => {
          ect.keypair = keypair;
          return ect;
        });
        setKeysPairLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    if (keysPairLoaded) {
      handleLoader(true);

      const deviceUuid = localStorage.getItem("device_uuid");

      Http.post("/auth/handshake", {
        uuid: deviceUuid,
        public_key: encryption.toPem("publicKey"),
      })
        .then(({ data }) => {
          setEncryption((ect) => ect.decryptSharedKey(data.payload));
          handleLoader(false);
        })
        .catch((err) => {
          handleLoader(false);
          console.error("ERROR:", err);
        });
    }
  }, [keysPairLoaded]);

  useEffect(() => {
    encryption.sharedKey != null ? fetchData() : null;
  }, [encryption.sharedKey]);

  const fetchData = () => {
    handleLoader(true);

    const uuid = localStorage.getItem("device_uuid");

    Http.get(`/users?uuid=${uuid}`)
      .then(({ data }) => {
        const decrypted = encryption.decrypt(data.payload);

        setUsers(decrypted.data);
        handleLoader(false);
      })
      .catch((error) => {
        handleLoader(false);
        console.error("ERROR:", error);

        Swal.fire({
          icon: "error",
          title: "Oups !",
          text: "An error occurred try later.",
        });
      });
  };

  const handleLoader = (show, message) => {
    if (typeof message === "string") {
      setLoader((l) => ({ ...l, show, message }));
    } else {
      setLoader((l) => ({ ...l, show }));
    }
  };

  const handleClose = () => setEditorState(false);

  const handleNewUser = () => {
    setSelected(initial);
    setEditorState(true);
  };

  const handleEditUser = (user) => {
    setSelected(user);
    setEditorState(true);
  };

  const handleDeletetUser = (user) => {
    if (users.length === 0) {
      return false;
    }

    Swal.fire({
      icon: "question",
      title: "Are you sure ?",
      text: "Are you sure you want to delete this user ?",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers((items) => items.filter((i) => i.id !== user.id));
      }
    });
  };

  const handleSave = (user) => {
    const exists = users.find((i) => i.id === user.id);
    let action = "saved";

    if (exists) {
      action = "updated";

      setUsers((items) =>
        items.map((item) => {
          return item.id === user.id ? user : item;
        })
      );
    } else {
      setUsers((list) => [...list, user]);
    }

    handleClose();

    Swal.fire({
      icon: "success",
      title: "Successfully",
      text: "The user has been successfully " + action + ".",
    });
  };

  return (
    <>
      <UserLoader show={loader.show} message={loader.message} />

      <div className="page-header mb-4">
        <Button variant="primary" onClick={handleNewUser}>
          Add New
        </Button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Info</th>
            <th scope="col">Contact</th>
            <th scope="col" className="align-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <UserLine
              key={idx}
              item={user}
              onEdit={handleEditUser}
              onDelete={handleDeletetUser}
            />
          ))}
        </tbody>
      </table>

      <UserEditor
        item={selected}
        state={editorState}
        onSave={handleSave}
        onClose={handleClose}
      />
    </>
  );
}

if (document.getElementById("users-manager")) {
  const container = document.getElementById("users-manager");
  createRoot(container).render(<UsersManager />);
}
