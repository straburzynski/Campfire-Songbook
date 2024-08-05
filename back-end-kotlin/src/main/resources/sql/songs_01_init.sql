CREATE TABLE IF NOT EXISTS SONG
(
    id     INTEGER AUTO_INCREMENT NOT NULL,
    title  VARCHAR(50)            NOT NULL,
    author VARCHAR(20)            NOT NULL,
    lyrics VARCHAR(20)            NOT NULL,
    PRIMARY KEY (id)
);

