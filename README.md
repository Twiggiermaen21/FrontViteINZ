<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
</p>

# 🗓️ AI Calendar Generator — Frontend

> **Interaktywna aplikacja kliencka do projektowania i generowania kalendarzy trójdzielnych AI.**

System B2B umożliwiający drukarniom oferowanie klientom spersonalizowanych kalendarzy trójdzielnych z grafikami wygenerowanymi przez sztuczną inteligencję. Frontend to nowoczesna aplikacja SPA (Single Page Application), która przeprowadza użytkownika przez kreator projektowania kalendarza (wybór stylu, atmosfery, kolorystyki itp.), integruje logowanie Google OAuth i prezentuje galerię wyników gotowych do generacji PDF na zapleczu.

---

## ✨ Kluczowe funkcjonalności

🎨 **Kreator krok po kroku** — responsywny i intuicyjny interfejs budowy promptu poprzez wybieranie metadanych (styl, kompozycja, atmosfera)

🖼️ **Podgląd wygenerowanych obrazów** — wbudowana galeria do przeglądania i wybierania wariantów dla nagłówka i poszczególnych miesięcy (reroll)

🔐 **Uwierzytelnianie** — wsparcie dla JWT oraz Google OAuth 2.0 (jedno kliknięcie do zalogowania)

🗂️ **Historia projektów** — dedykowany panel użytkownika prezentujący wcześniejsze prace i ich status

📱 **Responsywność i styl** — architektura UI oparta w całości na klasach Tailwind CSS dla płynnego działania na desktopach i urządzeniach mobilnych

---

## 🏗️ Architektura

```
┌─────────────────┐       REST API / JWT Auth       ┌──────────────────────┐
│   React App     │◄───────────────────────────────►│  Django / Gunicorn   │
│   (Vite + SWC)  │                                 │  (DRF Backend)       │
└─────────────────┘                                 └──────────┬───────────┘
         │                                                     │
         │ (UI, State Management)                              │ (Database, AI Gen)
         ▼                                                     ▼
┌──────────────────┐                                ┌──────────────────────┐
│ Tailwind CSS     │                                │  PostgreSQL, FLUX.1  │
│ React Router     │                                │  Together AI, Cloud  │
└──────────────────┘                                └──────────────────────┘
```

---

## 📁 Struktura projektu

```
frontend/
├── public/                  # Statyczne zasoby publiczne (ikony, manifesty)
├── src/                     # Główny kod źródłowy aplikacji
│   ├── assets/              # Zasoby graficzne, obrazki, tła
│   ├── components/          # Reużywalne i specyficzne dla funkcji komponenty React
│   │   ├── browseCalendarElements/
│   │   ├── calendarEditorElements/
│   │   ├── editCalendarElements/
│   │   ├── imageGeneratorElements/
│   │   ├── layoutElements/
│   │   ├── menuElements/
│   │   ├── startPage/
│   │   ├── AuthForm.jsx, CalendarEditor.jsx, CalendarList.jsx, Form.jsx, etc.
│   │
│   ├── pages/               # Widoki i główne strony aplikacji (Routing)
│   │   ├── ActivateAccount.jsx, BrowseCalendars.jsx, CreateCalendar.jsx
│   │   ├── Dashboard.jsx, ForgotPassword.jsx, Gallery.jsx, Generate.jsx
│   │   ├── Layout.jsx, Login.jsx, NotFound.jsx, ProductionList.jsx
│   │   ├── Register.jsx, ResetPassword.jsx, Settings.jsx, StaffPage.jsx, StartPage.jsx
│   │
│   ├── utils/               # Funkcje i skrypty pomocnicze
│   │   ├── autoFontSize.js
│   │   ├── dragUtils.js
│   │   ├── extractColorsFromImage.js
│   │   ├── getBottomSectionBackground.js
│   │   ├── getStatusStyle.js
│   │   ├── getYearPositionStyles.js
│   │   ├── monthHandlers.js
│   │   ├── textPadding.js
│   │   └── useCalendars.js
│   │
│   ├── api.js               # Globalna instancja Axios i interceptory
│   ├── App.jsx              # Komponent najwyższego poziomu z całą logiką Routingu
│   ├── constants.js         # Stałe tekstowe, konfiguracyjne, tokeny
│   ├── index.css            # Dyrektywy Tailwind i globalne style
│   └── main.jsx             # Punkt startowy aplikacji - definicja korzenia (Root)
│
├── .env                     # Zmienne środowiskowe (np. VITE_API_BASE_URL)
├── eslint.config.js         # Plik konfiguracyjny lintera ESLint
├── package.json             # Moduły, wersje bibliotek i skrypty pomocnicze (npm)
├── tailwind.config.js       # Rozszerzenia motywu Tailwind CSS (brak w projekcie, jeśli w vite.config lub brak pliku)
└── vite.config.js           # Konfiguracja pracy serwera kompilacji Vite
```

---

## 🔌 API i Integracje

Frontend integruje się z backendem Django poprzez RESTful API (szczegóły opisane w repozytorium backendu), ale również wewnątrz opiera się o kilka głównych mechanizmów:
- **`Axios` Interceptors:** Dodawanie nagłówków autoryzacyjnych (`Bearer token`) i przechwytywanie pomyłek 401 w celu odświeżania sesji.
- **`@react-oauth/google`:** Komponenty i hooki ułatwiające autoryzację po stronie klienta za pomocą kont Google.
- **`react-toastify`:** Globale notyfikacje wyświetlające komunikaty w prawym dolnym rogu na akcjach.

---

## ⚙️ Stos technologiczny

| Kategoria | Technologia |
|-----------|-------------|
| **Biblioteka UI** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) |
| **Bundler / Dev Server** | ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| **Routing / HTTP**| React Router DOM, Axios |
| **Konteneryzacja** | ![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat&logo=docker&logoColor=white) |

Zależności dodatkowe: `jwt-decode`, `lucide-react`, `react-icons`, `react-toastify`, `color-thief-browser`, `react-datepicker`.

---

## 🚀 Uruchomienie

### 💻 Uruchomienie lokalne (Dev Mode)

Jeżeli chcesz pracować nad aplikacją na żywo z szybką odświeżalnością ekranu (Hot Module Replacement):

```bash
# Sklonuj repozytorium, jeżeli tego jeszcze nie zrobiłeś
git clone https://github.com/Twiggiermaen21/FrontViteINZ.git
# Przejdź do katalogu aplikacji frontendowej
cd frontend

# Opcjonalnie stwórz .env na bazie .env.example (składnia VITE_*)
# cp .env.example .env

# Instalacja zależności
npm install

# Uruchomienie deweloperskiego środowiska Vite
npm run dev
```

Serwer frontendowy zostanie otwarty pod adresem: **http://localhost:5173**. Pamiętaj o uruchomieniu backendu obok.

### 🐳 Uruchomienie w Dockerze

Zbuduj i wystartuj z pomocą wielowarstwowego obrazu (Docker / Nginx):

```bash
cd frontend

# Zbudowanie obrazu serwującego produkcyjny build frontendu z Nginx
docker build -t frontend-app .

# Start kontenera z przemapowanym portem na przykład na 80:80
docker run -d -p 5173:5173 frontend-app
```

### Zmienne środowiskowe (.env)

```env
VITE_GOOGLE_CLIENT_ID=twoj_klucz_google_client_id.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8000
```
*(Uwaga: Ze względu na charakter środowiska Frontend, zmienne powinny zaczynać się prefiksem `VITE_` zgodnie z wymogami frameworka).*

---

## 📝 Licencja

Projekt realizowany w ramach pracy inżynierskiej.
