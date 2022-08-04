const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const contacts = require("./contacts.json").contacts;
const meetings = require("./meetings.json").meetings;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/contacts", (req, res) => {
  const contactsWithMeetings = contacts.map((contact) => {
    const contactMeetings = meetings.filter(
      (meeting) => meeting.contactId === contact.id
    );
    contact.meetings = contactMeetings;
    return contact;
  });

  res.json({ contacts: contactsWithMeetings });
});

app.post("/contacts", (req, res) => {
  const contact = req.body;
  contact.id = contacts.length + 1;
  contact.meetings = meetings.filter(
    (meeting) => meeting.contactId === contact.id
  );

  contacts.push(contact);

  res.status(201).json({ contact });
});

app.get("/contacts/:id", (req, res) => {
  const contact = contacts.find(
    (contact) => contact.id === Number(req.params.id)
  );

  if (contact) {
    contact.meetings = meetings.filter(
      (meeting) => meeting.contactId === contact.id
    );
    res.json({ contact });
  } else {
    res.json({ message: "Contact not found" });
  }
});

app.delete("/contacts/:id", (req, res) => {
  const contact = contacts.find(
    (contact) => contact.id === Number(req.params.id)
  );
  if (contact) {
    contacts.splice(contacts.indexOf(contact), 1);
    console.log(contact);
    res.status(200).json({ contact });
  } else {
    res.json({ message: "Contact not found" });
  }
});

app.put("/contacts/:id", (req, res) => {
  const oldContact = contacts.find(
    (contact) => contact.id === Number(req.params.id)
  );

  if (oldContact) {
    const updatedContact = req.body;
    updatedContact.id = Number(req.params.id);

    contacts.splice(contacts.indexOf(oldContact), 1, updatedContact);

    const contactMeetings = meetings.filter(
      (meeting) => meeting.contactId === updatedContact.id
    );

    res
      .status(201)
      .json({ contact: { ...updatedContact, meetings: contactMeetings } });
  } else {
    res.json({ message: "Contact not found" });
  }
});

app.get("/contacts/:contactId/meetings", (req, res) => {
  const contactMeetings = meetings.filter(
    (meeting) => Number(meeting.contactId) === Number(req.params.contactId)
  );

  res.json({ meetings: contactMeetings });
});

app.post("/contacts/:contactId/meetings/", (req, res) => {
  console.log(req.params);
  const newMeeting = req.body;
  newMeeting.contactId = Number(req.params.contactId);
  newMeeting.id = meetings[meetings.length - 1].id + 1;

  meetings.push(newMeeting);

  res.status(201).json({ meeting: newMeeting });
});

app.put("/contacts/:contactId/meetings/:meetingId", (req, res) => {
  const oldMeeting = meetings.find(
    (meeting) => meeting.id === Number(req.params.meetingId)
  );

  if (oldMeeting) {
    const updatedMeeting = {
      ...req.body,
      id: Number(req.params.meetingId),
      contactId: Number(req.params.contactId),
    };

    meetings.splice(meetings.indexOf(oldMeeting), 1, updatedMeeting);
    res.status(201).json({ meeting: updatedMeeting });
  } else {
    res.json({ message: "Meeting not found" });
  }
});

app.get("/meetings", (req, res) => {
  res.json({ meetings });
});

app.post("/meetings", (req, res) => {
  const newMeeting = req.body;
  newMeeting.id = meetings[meetings.length - 1].id + 1;

  meetings.push(newMeeting);

  res.json({ meeting: newMeeting });
});

const port = 3030;
app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}/`);
});
