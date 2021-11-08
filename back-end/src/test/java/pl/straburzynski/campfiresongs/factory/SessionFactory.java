package pl.straburzynski.campfiresongs.factory;

import pl.straburzynski.campfiresongs.session.model.Session;
import pl.straburzynski.campfiresongs.session.model.SessionDto;

import java.util.UUID;

public class SessionFactory {

    public static Session.SessionBuilder createSession() {
        return Session.builder()
                .id(UUID.randomUUID())
                .name("name")
                .password("encryptedPassword");
    }

    public static SessionDto.SessionDtoBuilder createSessionDto() {
        return SessionDto.builder()
                .id(UUID.randomUUID())
                .name("name")
                .password("encryptedPassword");
    }

}
