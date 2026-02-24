<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" />
</p>

# 🗓️ AI Calendar Generator — Frontend

> **Aplikacja kliencka do tworzenia kalendarzy trójdzielnych z grafikami wygenerowanymi przez AI — od pomysłu do pliku gotowego do druku.**

Interfejs użytkownika systemu B2B dla drukarni, umożliwiający klientom projektowanie spersonalizowanych kalendarzy trójdzielnych. Użytkownik wybiera parametry stylu, generuje grafiki AI, komponuje układ kalendarza i zleca produkcję pliku PSD gotowego do profesjonalnego druku.

---

## ✨ Kluczowe funkcjonalności

🎨 **Kreator grafik AI** — intuicyjny formularz do budowania promptów: wybór stylu artystycznego, kompozycji, kolorystyki, atmosfery, perspektywy i detali

📅 **Edytor kalendarza** — wizualny kreator z podglądem na żywo: ustawianie nagłówka, czcionek, kolorów dat, pól reklamowych i tła

🖼️ **Biblioteka grafik** — przeglądanie, zarządzanie i przypisywanie wygenerowanych grafik do pól kalendarza

📋 **Biblioteka projektów** — lista zapisanych kalendarzy z możliwością edycji, kopiowania i usuwania

🔍 **Podgląd na żywo** — wizualizacja kalendarza w przeglądarce przed zleceniem produkcji PSD

🛒 **Zlecenie druku** — wybór ilości sztuk, daty realizacji, dodanie wiadomości i śledzenie statusu zamówienia

👤 **System kont** — rejestracja, logowanie (e-mail + Google OAuth), zarządzanie profilem i awatarem

---

## 🏗️ Architektura aplikacji

```
┌─────────────────────────────────────────────────────────┐
│                    React App (Vite)                      │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Pages   │  │  Compo-  │  │  Hooks   │  │ State  │  │
│  │          │  │  nents   │  │          │  │ Mgmt   │  │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├────────┤  │
│  │ Calendar │  │ AI Form  │  │ useAuth  │  │Context │  │
│  │ Creator  │  │ Preview  │  │ useAPI   │  │  API   │  │
│  │ Gallery  │  │ Navbar   │  │ useCalendar│ │        │  │
│  │ Profile  │  │ Cards    │  │          │  │        │  │
│  │ Orders   │  │ Dialogs  │  │          │  │        │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
│                                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │              Axios — HTTP Client                   │  │
│  │         (JWT Token Auto-Refresh)                   │  │
│  └──────────────────────┬─────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTPS (REST API)
                          ▼
              ┌──────────────────────┐
              │  Django Backend API  │
              └──────────────────────┘
```

---

## 📁 Struktura projektu

```
frontend/
├── public/                     # Zasoby statyczne
│
├── src/
│   ├── assets/                 # Obrazy, ikony, fonty
│   │
│   ├── components/             # Komponenty współdzielone
│   │   ├── Navbar/             # Nawigacja główna
│   │   ├── Footer/             # Stopka
│   │   ├── ProtectedRoute/     # Ochrona tras (auth guard)
│   │   ├── ImageCard/          # Karta grafiki AI
│   │   ├── CalendarPreview/    # Podgląd kalendarza na żywo
│   │   └── LoadingSpinner/     # Wskaźniki ładowania
│   │
│   ├── pages/                  # Widoki / strony
│   │   ├── Home/               # Strona główna / landing
│   │   ├── Login/              # Logowanie (email + Google)
│   │   ├── Register/           # Rejestracja
│   │   ├── ForgotPassword/     # Resetowanie hasła
│   │   ├── Dashboard/          # Panel użytkownika
│   │   ├── CalendarCreator/    # Kreator kalendarza (wieloetapowy)
│   │   ├── CalendarEditor/     # Edycja istniejącego kalendarza
│   │   ├── ImageGenerator/     # Generator grafik AI
│   │   ├── ImageGallery/       # Biblioteka wygenerowanych grafik
│   │   ├── ProjectLibrary/     # Lista zapisanych projektów
│   │   ├── OrderForm/          # Formularz zlecenia druku
│   │   ├── OrderStatus/        # Śledzenie statusu zamówienia
│   │   └── Profile/            # Zarządzanie profilem
│   │
│   ├── context/                # React Context
│   │   ├── AuthContext.jsx     # Stan autoryzacji + tokeny JWT
│   │   └── CalendarContext.jsx # Stan edytowanego kalendarza
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.js          # Logika autoryzacji
│   │   ├── useAPI.js           # Wrapper na Axios z JWT
│   │   └── useCalendar.js     # Logika kalendarza
│   │
│   ├── services/               # Warstwa komunikacji z API
│   │   ├── api.js              # Konfiguracja Axios (base URL, interceptory)
│   │   ├── authService.js      # Endpointy autoryzacji
│   │   ├── calendarService.js  # Endpointy kalendarzy
│   │   ├── imageService.js     # Endpointy grafik AI
│   │   └── metadataService.js  # Endpointy metadanych (style, itp.)
│   │
│   ├── utils/                  # Helpery i stałe
│   │   ├── constants.js        # Stałe aplikacji
│   │   └── helpers.js          # Funkcje pomocnicze
│   │
│   ├── App.jsx                 # Główny komponent + routing
│   ├── main.jsx                # Entry point (Vite)
│   └── index.css               # Style globalne
│
├── .env                        # Zmienne środowiskowe
├── vite.config.js              # Konfiguracja Vite
├── package.json                # Zależności i skrypty
└── README.md
```

---

## 🖥️ Główne widoki aplikacji

### 🎨 Generator grafik AI
Formularz z parametrami do budowy promptu — użytkownik wybiera spośród predefiniowanych opcji:

| Parametr | Opis |
|----------|------|
| **Styl artystyczny** | Realizm, impresjonizm, abstrakcja, cyfrowy, itp. |
| **Kompozycja** | Centralna, symetryczna, panoramiczna, z regułą trójpodziału |
| **Kolorystyka** | Ciepła, zimna, pastelowa, monochromatyczna, kontrastowa |
| **Atmosfera** | Spokojna, dynamiczna, tajemnicza, radosna, nostalgiczna |
| **Perspektywa** | Z lotu ptaka, z poziomu oczu, makro, panorama |
| **Detale** | Minimalistyczne, umiarkowane, bogate w szczegóły |
| **Realizm** | Fotorealistyczny, stylizowany, artystyczny |
| **Tło** | Natura, miasto, abstrakcja, gradient, jednokolorowe |
| **Inspiracja** | Dodatkowe wskazówki i motywy |
| **Styl narracyjny** | Poetycki, techniczny, opisowy |

### 📅 Kreator kalendarza
Wieloetapowy wizard do kompletowania kalendarza:

```
Krok 1 → Nadanie nazwy kalendarzowi
Krok 2 → Dodanie zdjęcia główki (nagłówek)
Krok 3 → Ustawienie czcionki i wielkości dat
Krok 4 → Wybór rodzaju tła (kolor / gradient / grafika)
Krok 5 → Wstawianie zdjęć i tekstów w pola reklamowe
Krok 6 → Podgląd i zapis
```

### 🛒 Zlecenie do druku
Formularz finalizacji z polami: ilość sztuk, data realizacji, dodatkowa wiadomość. Po złożeniu — śledzenie statusu zamówienia.

---

## ⚙️ Stos technologiczny

| Kategoria | Technologia |
|-----------|-------------|
| **Framework** | React 18 |
| **Bundler** | Vite |
| **UI Library** | Material-UI (MUI) |
| **Routing** | React Router v6 |
| **Formularze** | Formik + Yup (walidacja) |
| **HTTP Client** | Axios (z interceptorami JWT) |
| **Autoryzacja** | JWT + Google OAuth 2.0 |
| **State management** | React Context API |
| **Hosting** | Możliwość deploy na Vercel / Netlify |

---

## 🔐 Autoryzacja

Aplikacja obsługuje dwa sposoby logowania:

```
┌─────────────────────────────────────┐
│         Ekran logowania             │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  📧 E-mail + Hasło         │   │
│   └─────────────────────────────┘   │
│                                     │
│             — lub —                 │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  🔵 Zaloguj przez Google   │   │
│   └─────────────────────────────┘   │
│                                     │
│   Nie masz konta? Zarejestruj się   │
│   Zapomniałeś hasła?               │
└─────────────────────────────────────┘
```

Tokeny JWT są automatycznie odświeżane przez interceptor Axios — użytkownik nie jest wylogowywany w trakcie pracy.

---

## 🔄 Komunikacja z API

Warstwa `services/` zapewnia czystą abstrakcję nad endpointami backendowymi:

```javascript
// Przykład — generowanie grafiki AI
const response = await imageService.generate({
  style: "fotorealistyczny",
  composition: "centralna",
  colors: "ciepła",
  atmosphere: "spokojna",
  prompt: "Zimowy krajobraz z ośnieżonymi górami..."
});

// Przykład — zlecenie produkcji PSD
const production = await calendarService.produce(calendarId);
```

---

## 🚀 Uruchomienie

```bash
# Klonowanie repozytorium
git clone https://github.com/your-username/ai-calendar-frontend.git
cd ai-calendar-frontend

# Instalacja zależności
npm install

# Konfiguracja zmiennych środowiskowych
cp .env.example .env
# Uzupełnij adres API backendu i klucz Google OAuth

# Uruchomienie serwera deweloperskiego
npm run dev

# Build produkcyjny
npm run build

# Podgląd buildu
npm run preview
```

### Zmienne środowiskowe

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

---

## 📱 Responsywność

Aplikacja jest w pełni responsywna dzięki Material-UI i systemowi Grid/Breakpoints:

| Urządzenie | Breakpoint | Wsparcie |
|------------|-----------|----------|
| 📱 Mobile | `< 600px` | ✅ |
| 📱 Tablet | `600–960px` | ✅ |
| 💻 Desktop | `960–1280px` | ✅ |
| 🖥️ Large | `> 1280px` | ✅ |

---

## 🔗 Powiązane repozytoria

| Repozytorium | Opis |
|-------------|------|
| **[ai-calendar-backend](../ai-calendar-backend)** | Django REST Framework API — generowanie grafik, produkcja PSD, baza danych |

---

## 📝 Licencja

Projekt realizowany w ramach pracy inżynierskiej.

---

<p align="center">
  <sub>Built with ❤️ and AI</sub>
</p>
