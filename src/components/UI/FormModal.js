import React, { Fragment, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./FormModal.module.css";
import Card from "./Card";
import Button from "./Button";
import { TextField, Box, Slider } from "@mui/material";

const marks = [
  {
    value: 0,
    label: "Niveau 1",
  },
  {
    value: 25,
    label: "Niveau 2",
  },
  {
    value: 50,
    label: "Niveau 3",
  },
  {
    value: 75,
    label: "Niveau 4",
  },
  {
    value: 100,
    label: "Niveau 5",
  },
];

function valuetext(value) {
  return `${value}°C`;
}

const Backdrop = (props) => {
  return <div className={styles.backdrop} onClick={props.onConfirm} />;
};

const ModalOverlay = (props) => {
  const [value, setValue] = useState(0);
  const nameRef = useRef();
  const subjectRef = useRef();
  const handleLevel = (value) => {
    return marks[marks.findIndex((level) => level.value === value)].label;
  };

  const getRefContent = () => {
    props.setMyData({
      name: nameRef.current.value,
      subject: subjectRef.current.value,
      level: handleLevel(value),
    });
  };
  const changeValue = (event, value) => {
    setValue(value);
  };

  return (
    <Card className={styles.modal}>
      <header className={styles.header}>
        <h2>Ajouter séance</h2>
      </header>
      <div className={styles.content}>
        <TextField
          inputRef={nameRef}
          margin="normal"
          id="name"
          variant="outlined"
          required
          fullWidth
          autoFocus
          placeholder="Entrez le nom de l'instructeur"
        />
        <TextField
          inputRef={subjectRef}
          id="subject"
          variant="outlined"
          required
          fullWidth
          placeholder="Entrer le nom du sujet"
          margin="normal"
        />
        <Box sx={{ width: 530, margin: 5 }}>
          <Slider
            aria-label="Custom levels"
            defaultValue={0}
            getAriaValueText={valuetext}
            step={25}
            marks={marks}
            onChange={changeValue}
          />
        </Box>
      </div>
      <footer className={styles.actions}>
        <Button onClick={props.onConfirm}>FERMER</Button>
        <Button
          onClick={() => {
            getRefContent();
            props.onConfirm();
          }}
        >
          AJOUTER
        </Button>
      </footer>
    </Card>
  );
};
const FormModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          setMyData={props.setMyData}
          onConfirm={props.onConfirm}
        />,
        document.getElementById("overlay-root")
      )}
    </Fragment>
  );
};

export default FormModal;
