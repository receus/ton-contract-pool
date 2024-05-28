import "@stdlib/deploy";

message Update {
    queryId: Int as uint64;
}

contract TimestampContract with Deployable {

    id: Int as uint32;
    created: Int as uint64;
    lastUpdated: Int as uint64;

    init(id: Int) {
        self.id = id;
        self.created = now();
        self.lastUpdated = self.created;
    }

    receive(msg: Update) {
        self.lastUpdated = now();
    }

    get fun created(): Int {
        return self.created;
    }

    get fun lastUpdated(): Int {
        return self.lastUpdated;
    }
}