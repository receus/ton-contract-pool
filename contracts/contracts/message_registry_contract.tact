import "@stdlib/deploy";

message UpdateMessage {
    queryId: Int as uint64;  // Tracking identifier for the request
    newMessage: String;      // New message to be stored
}

contract MessageRegistryContract with Deployable {

    id: Int as uint32;
    created: Int as uint64;          // Timestamp of contract creation
    lastUpdated: Int as uint64;      // Timestamp of the last update
    firstMessage: String;           // First message ever recorded
    lastMessage: String;            // Most recent message

    init(id: Int) {
        self.id = id;
        self.created = now();        // Initialize with the creation time
        self.lastUpdated = self.created;  // Initially, last updated is the creation time
        self.firstMessage = "";      // Initially empty
        self.lastMessage = "";       // Initially empty
    }

    receive(msg: UpdateMessage) {
        if (self.firstMessage == "") {   // Check if first message is not set
            self.firstMessage = msg.newMessage; // Set first message if not already set
        }
        self.lastMessage = msg.newMessage;      // Always update to the latest message
        self.lastUpdated = now();               // Update the last updated timestamp
    }

    get fun created(): Int {
        return self.created;
    }

    get fun lastUpdated(): Int {
        return self.lastUpdated;
    }

    get fun firstMessage(): String {
        return self.firstMessage;
    }

    get fun lastMessage(): String {
        return self.lastMessage;
    }

    get fun id(): Int {
        return self.id;
    }
}