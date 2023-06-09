export const PL = {
    home: {
        create: 'Stwórz',
        enter_session_name: 'Wpisz nazwę sesji',
        join: 'Dołącz',
        password: 'Hasło',
        session_name: 'Nazwa sesji',
        start: 'Start',
    },
    header: {
        about: "O aplikacji",
        current_session: 'Aktualna sesja',
        exit_session: 'Zakończ sesję',
        external_search: 'Szukaj w Internecie',
        favorite_songs: 'Ulubione piosenki',
        preferences: 'Opcje',
        play_on_youtube: 'Odtwórz na Youtube',
        share: 'Udostępnij',
        song_list: 'Lista piosenek',
    },
    dialog: {
        delete_song_confirmation: 'Czy jesteś pewien, że chcesz usunąć tę piosenkę?',
        exit_offline_mode_confirmation: 'Wyjść z trybu offline?',
        exit_session_confirmation: 'Czy jesteś pewien, że chcesz zakończyć sesję?',
        song_added: 'Zapisano piosenkę',
        no_song_selected: 'Nie wybrano jeszcze piosenki',
    },
    editor: {
        author_required: 'Autor jest wymagany',
        lyrics_required: 'Tekst jest wymagany',
        title_required: 'Tytuł jest wymagany',
        song_deleted: 'Piosenka została usunięta',
        song_editor: 'Edycja piosenek',
        song_updated: 'Piosenka została zapisana',
    },
    exception: {
        chord_not_found: 'Nie znaleziono akordu',
        enter_song_name: 'Wpisz tytuł piosenki',
        external_api_exception: 'Błąd szukania w Internecie {{message}}',
        no_songs_found: 'Nie znaleziono piosenek',
        not_authorized_to_session: 'Brak autoryzacji do sesji',
        not_found: 'Nie znaleziono',
        cannot_save_song: 'Nie można zapisać piosenki',
        cannot_share: 'Nie można udostępnić na tym urządzeniu',
        session_not_found: 'Nie znaleziono sesji {{name}}',
        song_exists: 'Piosenka {{title}} autora {{author}} została już zapisana',
        video_not_found: 'Nie znaleziono video',
    },
    common: {
        add: 'Dodaj',
        author: 'Autor',
        changelog: 'Lista zmian',
        close: 'Zamknij',
        default: 'Domyślnie',
        delete: 'Usuń',
        home: 'Strona główna',
        hide_chords: 'Ukryj chwyty',
        hide_transposition: 'Ukryj transpozycję',
        lyrics: 'Tekst',
        no: 'Nie',
        pull_to_refresh: 'Pociągnij, aby odświeżyć',
        remove: 'Usuń',
        save: 'Zapisz',
        select: 'Wybierz',
        select_song: 'Wybierz piosenkę',
        show_chords: 'Pokaż chwyty',
        show_transposition: 'Pokaż transpozycję',
        source: 'Źródło',
        search: 'Szukaj',
        search_by_title: 'Szukaj po tytule',
        title: 'Tytuł',
        version: 'Wersja',
        yes: 'Tak',
    },
    preferences: {
        autoColumnsOn: 'Automatyczne kolumny',
        columnsCount: 'Liczba kolumn',
        language: 'Język',
        instrument: 'Instrument',
        font_size: 'Wielkość czcionki',
        offlineMode: 'Tryb offline',
    },
    instrument: {
        guitar: 'Gitara',
        ukulele: 'Ukulele',
    },
    language: {
        english: 'Angielski',
        polish: 'Polski',
    },
    share: {
        text: 'Campfire Songbook - dołącz do sesji: {{sessionName}}',
        success: 'URL sesji został skopiowany do schowka',
    },
    changelog: {
        '0.12.0': '\'Pociągnij, aby odświeżyć\' dostępne dla ekranu uczestnika sesji.',
        '0.11.0': 'Tryb offline - możliwość korzystania z aplikacji bez dostępu do Internetu. Wymagane jest wcześniejsze połączenie z Internetem, aby pobrać piosenki.',
        '0.10.0': 'Sekcja \'O aplikacji\' z listą zmian i aktualną wersją.',
        '0.9.0': 'Ulubione piosenki - nowe menu z listą piosenek. Dodawanie i usuwanie z ekranu listy - menu w ikonce lupy.',
        '0.8.0': 'Automatyczna i ręczna obsługa kolumn w opcjach. Maksymalnie 3 kolumny.',
        '0.7.0': 'Dodanie nowego źródła danych w wyszukiwaniu - Ultimate Guitar. W wynikach na liście pokazuje się ikonka źródła.',
        '0.6.0': 'Dostosowanie widoku piosenki do drukowania.',
        '0.5.0': 'Transpozycja chwytów piosenek. Widoczna tylko dla hosta sesji na ekranie wybranej piosenki.',
        '0.4.0': 'Konfiguracja wielkości czcionki, języka aplikacji i typu instrumentu (gitara lub ukulele).',
        '0.3.0': 'Wyszukiwanie i odtwarzanie aktywnej piosenki z Youtube.',
        '0.2.0': 'Udostępnianie linku dołączenia do sesji na urządzeniach mobilnych i w przeglądarce',
        '0.1.0': 'Tworzenie i dołączanie do istniejących sesji, wyszukiwanie piosenek ze Śpiewnika Wywrota i zapisywanie do lokalnej bazy danych.',
    }
};
