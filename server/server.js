const express = require("express");
const app = express();
const twilio = require("twilio");
const db = require("./database");
const cors = require("cors");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
app.use(bodyParser.urlencoded({ extended: true }));

  
// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware to enable CORS
// Ensure TWILIO_PHONE_NUMBERS is a comma-separated list of numbers in .env
const twilioPhoneNumbers = process.env.TWILIO_PHONE_NUMBERS.split(",");
let phoneNumberIndex = 0; // Index to track the current Twilio number being used

app.post("/api/send-bulk-sms", async (req, res) => {
  const { Cmessage, campaignName, campaignDescription, state, cities, Greeting } =
    req.body;
  const startDate = new Date();

  const query = `
  SELECT Phone , Name , ID
  FROM agents
  WHERE State = ? AND City IN (?);
`;
const [rows, fields] = await db.query(query, [state, cities]);
    const count =  rows.length;

  const campaignQuery = `
      INSERT INTO campaigns (title, description, startDate, message, state, city , count)
      VALUES (?, ?, ?, ?, ?, ? , ?);
    `;
  const [campaignResult] = await db.query(campaignQuery, [  
    campaignName,
    campaignDescription,
    startDate,
    Cmessage,
    state,
    cities,
    count
  ]);
 
  const campaignId = campaignResult.insertId;
  

  const delayPerNumber = 1000; // Assuming 1 message per second per Twilio number
  
  // console.log(rows);
  // const numbers = rows.map((row) => row.Phone);
  // const names = rows.map((row) => row.Name);
  // const IDs = rows.map((row) => row.ID);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Enhanced sendSMS function to retry with the next "from" number upon failure
  const sendSMS = async (to, Cmessage, name, agentID) => {
    const fromIndex = phoneNumberIndex % twilioPhoneNumbers.length;
    const fromNumber = twilioPhoneNumbers[fromIndex];
    try {
      console.log(Cmessage);
      const message = await twilioClient.messages.create({
        to,
        from: fromNumber,
        body:  Greeting +" " + name + " " + Cmessage
      });

      const insertQuery = `
      INSERT INTO messages ( campaignID, agentID, sendDateTime  , twilioSid)
      VALUES (?, ?, ?, ?);
  `;
      await db.query(insertQuery, [
        campaignId,
        agentID,
        message.dateCreated,
        message.sid,
      ]);

      console.log(message);

      console.log(
        `Message sent from ${fromNumber} to ${to} with SID: ${message.sid}`
      );
      return true; // Return true on successful send
    } catch (error) {
      console.error(
        `Failed to send message from ${fromNumber} to ${to}. Error: ${error.message}`
      );
      return false;
    }
  };
  const contacts = rows.map((row) => ({
    id: row.ID,
    name: row.Name,
    number: row.Phone,
  }));
  console.log(contacts);

  for (const contact of contacts) {
    const isSuccess = await sendSMS(
      contact.number,
      Cmessage,
      contact.name,
      contact.id
    );
    if (!isSuccess) {
      console.log(`Failed to send message to ${contact.number}. Skipping...`);
      continue; // Skip the rest of this loop iteration and move to the next contact
    }
    phoneNumberIndex = (phoneNumberIndex + 1) % twilioPhoneNumbers.length;

    if (phoneNumberIndex === 0) {
      await wait(delayPerNumber);
    }
  }

  res.json({ message: "Messages are being sent" });
});

app.get("/api/twilio/update-status", async (req, res) => {
  try {
  const sql = `SELECT twilioSid FROM messages `;
  const [results] = await db.query(sql);
    if (results.length === 0) {
      return res.status(404).send('No records found');
    }

    const messageSid = results.map(row => row.twilioSid);
    const messageStatuses = await Promise.all(
      messageSid.map(async (sid) => {
        const message = await twilioClient.messages(sid).fetch();
        const query = `UPDATE messages SET status = ? WHERE twilioSid = ?`;
        await db.query(query, [message.status, sid]); 
        return { sid: sid, status: message.status };
      })
    );

    res.status(200).json({ message: 'Successfully fetched message statuses', data: messageStatuses });

  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send('Error querying the database');
  }
});
  

app.get("/api/getallmessages/:pageno?", async (req, res) => {
  try {
    // Use the path parameter 'pageno', default to 1 if not provided
    const pageno = parseInt(req.params.pageno) || 1;
    const limit = 10; // Set a fixed limit or you could also accept this from query params

    const offset = (pageno - 1) * limit;

    const sql = `SELECT * FROM messages LIMIT ? OFFSET ?`;

    // Execute the query with the calculated limit and offset
    const [results] = await db.query(sql, [limit, offset]);

    // Fetch the total count of messages for pagination information
    const [totalResults] = await db.query("SELECT COUNT(*) AS total FROM messages");
    const total = totalResults[0].total;
    const totalPages = Math.ceil(total / limit);

    // Send paginated results along with total pages and the current page
    res.json({ data: results, total, totalPages, currentPage: pageno });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("An error occurred while fetching messages.");
  }
}); 
app.get('/api/', (req, res) => {
  // Construct a custom message
  const customMessage = "This is a custom message.";

  // Send the custom message as a response
  res.status(200).send({ message: customMessage  , 
    twilioPhoneNumbers: twilioPhoneNumbers , 
    db: db 
  });
});
  
app.get("/api/campaigns/:pageno", async (req, res) => {
  try {
    // Using 'pageno' as a path parameter, default to 1 if not provided
    const pageno = parseInt(req.params.pageno) || 1;
    const limit = parseInt(req.query.limit) || 10; // 'limit' can still be a query parameter
    const offset = (pageno - 1) * limit;

    const sql = "SELECT id, title, description, startDate, endDate, message, city, state, count FROM campaigns LIMIT ? OFFSET ?";
    console.log(sql);

    // Using connection pool to execute query swith pagination
    const [results] = await db.query(sql, [limit, offset]);

    // Optional: Fetch total count of campaigns for pagination info
    const [totalResults] = await db.query("SELECT COUNT(*) AS total FROM campaigns");
    const total = totalResults[0].total;
    const totalPages = Math.ceil(total / limit);

    // Sending paginated results along with total pages and current page
    res.json({ data: results, total, totalPages, currentPage: pageno });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("An error occurred while fetching campaigns.");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
