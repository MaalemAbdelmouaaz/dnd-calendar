import React, { useCallback, useEffect, useState, useRef } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/fr";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./App.css";
import FormModal from "./components/UI/FormModal";
import Wrapper from "./helpers/Wrapper";
import events from "./resources/events";


const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
// const events = JSON.parse(localStorage.getItem("events")) ?? [];
console.log(events);
export default function DragAndDrop() {
  const clickRef = useRef(null)
  const [myEvents, setMyEvents] = useState(events);
  const [myForm, setMyForm] = useState();
  const [myData, setMyData] = useState();
  const [time, setTime] = useState();

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      setMyForm(true);
      setTime({ start, end });
    },
    [setMyForm]
  );

  useEffect(() => {
    let id = Math.random().toString();
    let title = myData?.name;
    let start = time?.start;
    let end = time?.end;
    if (title) {
      setMyEvents((prev) => [...prev, { id, start, end, title }]);
      setMyData();
    }
  }, [myData, time]);

  
  const onDoubleClickEvent = useCallback((calEvent) => {
    /**
     * Notice our use of the same ref as above.
     */
    window.clearTimeout(clickRef?.current)
    clickRef.current = window.setTimeout(() => {
      window.alert(`${calEvent.id} and ${calEvent.title}`);
    }, 250)
  }, [])

  

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end, allDay }];
      });
    },
    [setMyEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setMyEvents]
  );

  const formHandler = () => {
    setMyForm(null);
  };

  return (
    <Wrapper>
      {myForm && <FormModal setMyData={setMyData} onConfirm={formHandler} />}
      <DragAndDropCalendar
        defaultView={Views.WEEK}
        events={myEvents}
        localizer={localizer}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        onSelectSlot={handleSelectSlot}
        onDoubleClickEvent={onDoubleClickEvent}
        min={new Date(0, 0, 0, 8, 0, 0)}
        max={new Date(0, 0, 0, 23, 0, 0)}
        resizable
        selectable
        popup
        style={{ height: "820px" }}
      />
    </Wrapper>
  );
}
