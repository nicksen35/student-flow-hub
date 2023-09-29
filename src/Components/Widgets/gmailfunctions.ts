export async function GetMail(setMail, maxResults) {
    const authinstance = gapi.auth2.getAuthInstance();
    const profile = authinstance.currentUser.get();
    const email = profile.wt.cu;
  
    // List the first 25 email messages
    const listResponse = await gapi.client.gmail.users.messages.list({
      userId: "me",
      maxResults: 25, // Add this parameter to limit the number of results
      // You can add other query parameters to filter messages if needed
      // For example, to filter by label, use: q: "label:inbox"
    });
  
    // Retrieve details for each message
    const messages = listResponse.result.messages || [];
    const allEmails = [];
  
    // Create an array of message detail fetch promises
    const messagePromises = messages.map(async (message) => {
      const messageId = message.id;
  
      // Get the details of the message
      const messageResponse = await gapi.client.gmail.users.messages.get({
        userId: "me",
        id: messageId,
      });
      
      const { id, internalDate, labelIds, snippet } = messageResponse.result;
      const date = new Date(Number(internalDate));
      const formattedDate = date.toLocaleString(); // Use appropriate options for formatting
      // Access the subject (header title) from the headers
      const headers = messageResponse.result.payload.headers;
      let subject = "";
  
      for (const header of headers) {
        if (header.name === "Subject") {
          subject = header.value;
          break; // Found the subject, no need to continue searching
        }
      }
  
      return {
        gmail_subject: subject,
        gmail_id: id,
        gmail_date: formattedDate,
        gmail_labelsId: labelIds,
        gmail_snippet: snippet,
      };
    });
  
    // Fetch message details in parallel
    const detailedMessages = await Promise.all(messagePromises);
  
    allEmails.push(...detailedMessages);
  
    setMail(allEmails);
  
    console.log(allEmails);
  }
  