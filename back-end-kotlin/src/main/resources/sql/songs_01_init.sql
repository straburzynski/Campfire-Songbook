CREATE TABLE IF NOT EXISTS SONGS
(
    id     VARCHAR(60) DEFAULT RANDOM_UUID() PRIMARY KEY,
    title  VARCHAR(50) NOT NULL,
    author VARCHAR(20) NOT NULL,
    lyrics VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO SONGS (title, author, lyrics)
VALUES ('value1', 'value2', 'value3');


INSERT INTO SONGS (title, author, lyrics)
VALUES ('value1a', 'value2a', 'value3a');

SELECT *
FROM SONGS;