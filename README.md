# Kundenverwaltung – Multi-Page (3 Seiten) – V2
Stand: 2025-10-21

**Wesentliche Änderungen gegenüber V1**
- **Adresserfassung als echte Felder** (StreetNr, ZIP, City, CountryID) für **Adresse** und **Rechnungsadresse**.
- Beim **Erstellen/Aktualisieren** werden die Adressen zuerst **upsertet** (POST `/Address` bzw. POST `/Address/{id}`), die erhaltenen IDs werden anschließend im **Customer**-Payload verwendet.
- **Suche** wurde auf **Name/Email + Adresse (Street/ZIP/City)** umgestellt (statt ID). Grundlage `GET /CustomerView`.

**Seiten**
1. `index.html` – Übersicht + Volltextfilter (Name/Email/Adresse/Ort/PLZ), CSV
2. `find.html` – Suche über Felder (Name/Email/Adresse/Ort/PLZ)
3. `edit.html` – Customer-Form + Address/Billing-Address als echte Adressen; interne IDs werden automatisch ermittelt/angelegt

**API-Operationen (gemäß Vorgabe)**
- `GET /CustomerView`, `GET /Customer`, `GET /Address`, `GET /Country`
- `POST /Customer` (Create), `POST /Customer/{id}` (Update), `DELETE /Customer/{id}`
- `POST /Address` (Create), `POST /Address/{id}` (Update)
- `POST /Country/{ISO}` (Update/Upsert)
