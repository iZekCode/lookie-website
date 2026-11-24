Last updated: 18 November 2026

Lookie is a painting app for children on iPad. A child paints in the air: the front camera sees the hand and arm, and paint appears on the canvas. This policy explains what data we hold, what it is for, and how to delete it. We kept it short so a parent can read it to the end.

Developer: Filbert Naldo Wijaya, Tangerang, Banten, Indonesia. Contact: littlecrewproject@gmail.com.

## In short

- Camera images never leave the iPad. The hand and arm are recognised on the iPad itself.
- Without an account, everything stays on this iPad and we receive nothing.
- With Sign in with Apple, paintings and movement stats are backed up to our server.
- A photo a child picks for "Buat Sendiri" is sent to Google Gemini to turn it into an outline, and we do not keep it.
- No ads, no trackers, no third-party analytics. We do not sell data.
- A parent can delete the account and all its data at any time from inside the app.

## Who uses Lookie

Lookie is made for children and used together with a parent or guardian. The account is created by the parent or guardian, not by the child. One account is for one child. We do not ask for a child's full name, date of birth, address or phone number.

## Without an account (guest mode)

A child can paint without an account. In this mode the paintings, stats and nickname are kept on the iPad only. We receive nothing. If the app is deleted or the iPad is replaced, those paintings are lost. The profile page in the app says so too.

## Data we keep after Sign in with Apple

Once a parent chooses Sign in with Apple, we keep:

| Data | What it is | What it is for |
|---|---|---|
| Account | An account identifier from Apple. We do not ask for a name or email. | Recognising the account and restoring paintings on a new iPad |
| Agreement | The time and version of the "Mulai" agreement | Record that the parent agreed |
| Nickname | Optional, at most 20 characters, typed by the family | Shown on the profile page |
| Paintings | The PNG image of each painting, its date, and which template was used | Gallery and backup |
| Movement stats | Painting time, heatmap of hand positions (one per hand), time with a closed fist per hand to estimate the dominant hand, and range-of-motion (ROM) values | The Report page |
| Child-made templates | Title and outline paths from "Buat Sendiri" (not the original photo) | Showing that outline again on any iPad |
| Daily limit log | The time of each "Buat Sendiri" request | Limiting each account to 20 pictures a day |

Movement stats are 2D estimates from the camera. They are not medical measurements and are not for diagnosis.

## Camera

Lookie uses the front camera only while a child paints, to recognise the position of the hand and arm. Recognition runs on the iPad with Apple's Vision framework. Camera images are not recorded, not stored and not sent anywhere. Only the resulting numbers in the table above are kept.

## "Buat Sendiri" and Google Gemini

"Buat Sendiri" needs a signed-in account. A child can pick a photo, take a photo, or type a few words. The photo (scaled down to a JPEG of at most 768 pixels) or the words are sent through our server to Google Gemini, which turns them into an outline to colour in.

- We do not keep the photo or the words. Only the resulting outline is kept.
- While Gemini handles the request, Google's data terms apply. We use the paid Gemini service, which according to Google does not use inputs to train models.
- This is the only image from a child's world that leaves the iPad. Parents should supervise and avoid photos that show faces, names or private places.

## Third parties that handle data

| Party | Role | Data |
|---|---|---|
| Apple | Sign in with Apple | The sign-in itself; we receive only an account identifier |
| Supabase | Database and file storage, servers in Singapore (ap-southeast-1) | All data in the table above |
| Google (Gemini) | Makes the outlines | The photo or words from "Buat Sendiri" while being processed |

We use no ads, no analytics SDKs and no trackers. We do not sell data or share it for marketing.

## How long we keep it

- Paintings, stats and templates are kept until a parent deletes them or deletes the account.
- A deleted painting or template is marked as deleted so the deletion reaches other iPads, then removed from the server for good after 90 days.
- The daily limit log is deleted automatically after 2 days.

## Deleting data

- **Delete account** (profile page, for a signed-in account): deletes the account, all paintings, stats, templates and files on our storage, and the paintings on that iPad.
- **Sign out**: the app finishes the backup first, then erases the paintings on that iPad so a shared iPad does not copy them into another account. The parent is warned if something is not yet backed up.
- **Guest mode**: deleting the app deletes everything, because we hold no copy.
- You can also email littlecrewproject@gmail.com.

## Parents' rights

A parent or guardian may see, request a copy of, correct and delete the child's data, and withdraw consent. Email littlecrewproject@gmail.com and we reply within 7 working days. Withdrawing consent means deleting the account.

## Security

Data travels over HTTPS. Paintings are kept in private storage, and row-level access rules make sure an account can read only its own data. No system is completely safe; if a breach affects users we will tell them as the law requires.

## Changes to this policy

If this policy changes in substance, the app shows the "Mulai" screen again so a parent can read it and agree again.

## Applicable law

This policy follows the law of the Republic of Indonesia, including Law No. 27 of 2022 on Personal Data Protection.

## Contact

littlecrewproject@gmail.com · Tangerang, Banten, Indonesia
