**Last updated: 18 November 2026**

Lookie is a painting app for children on iPad. Children paint in the air: the front camera detects their hand and arm movements, and brushstrokes appear on the canvas. This policy explains what data we store, why we use it, and how it can be deleted. We have kept it concise and easy for parents to understand.

**Developer:** Little Crew - Tangerang, Banten, Indonesia.  
**Contact:** littlecrewproject@gmail.com

## In short

- Camera images never leave the iPad. Hand and arm detection takes place directly on the device.
- Without an account, all data stays on the iPad, and we do not receive any of it.
- With Sign in with Apple, paintings and movement statistics are backed up to our server.
- Photos selected through the custom template creation feature are sent to Google Gemini to be turned into outlines. We do not store these photos.
- Lookie does not use ads, trackers, or third-party analytics. We do not sell user data.
- Parents can delete the account and all associated data at any time from within the app.

## Who uses Lookie?

Lookie is designed for children to use together with a parent or guardian. Accounts are created by parents or guardians, not by children. Each account is for one child.

We do not ask for a child's full name, date of birth, address, or phone number.

## Without an account (Guest Mode)

Children can paint without creating an account. In this mode, paintings, statistics, and nicknames are stored only on the iPad being used. We do not receive any data from this activity.

If the app is deleted or the iPad is replaced, the stored paintings will be lost. This information is also stated on the app's profile page.

## Data we store after Sign in with Apple

Once a parent chooses Sign in with Apple, we store the following data:

| Data | What it contains | Why we use it |
|---|---|---|
| Account | An account identifier from Apple. We do not ask for a name or email address. | To recognise the account and restore paintings on a new iPad. |
| Consent | The time and version of the agreement shown on the Start screen. | To keep a record of the parent's consent. |
| Nickname | Optional, up to 20 characters, entered by the family. | To display on the profile page. |
| Paintings | PNG images of each painting, its creation date, and the template used. | To display paintings in the gallery and back them up. |
| Movement statistics | Painting duration, hand-position heatmaps (one for each hand), time spent making a fist with each hand to estimate the dominant hand, and range-of-motion (ROM) values. | To display on the Report page. |
| Child-created templates | Titles and outline paths generated through the custom template creation feature, not the original photos. | To display the same outlines again on any iPad. |
| Daily limit log | The time of each custom template creation request. | To limit each account to 2 images per day. |

Movement statistics are two-dimensional estimates based on camera data. They are not medical measurements and are not intended for diagnosis.

## Camera

Lookie uses the front camera only while a child is painting, to detect the position of their hands and arms. This detection happens directly on the iPad using Apple's Vision framework.

Camera images are not recorded, stored, or sent anywhere. The only data we store are the movement measurements described in the table above.

## Custom template creation

The custom template creation feature requires a signed-in account. Children can choose a photo from their gallery, take a new photo, or type a few words to create a template.

The selected photo (resized to a JPEG with a maximum size of 768 pixels) or entered text is sent through our server to Google Gemini. The service turns the photo or text into an outline that can be coloured in.

- We do not store the photos or text submitted. Only the resulting outline is stored.
- Google's data terms apply while Gemini processes the request.
- This is the only type of image from a child's environment that is sent outside the iPad. Parents should supervise children when using this feature and avoid photos that show faces, names, or private places.

## Third parties that handle data

| Party | Role | Data handled |
|---|---|---|
| Apple | Sign in with Apple | The sign-in process. We receive only an account identifier. |
| Supabase | Database and file storage. | All data listed in the table above. |
| Google (Gemini) | Generates image outlines. | Photos or text submitted through the custom template creation feature while being processed. |

We do not use ads, analytics SDKs, or trackers. We do not sell data or share it for marketing purposes.

## How long we keep data

- Paintings, statistics, and templates are kept until a parent deletes them or deletes the account.
- Deleted paintings or templates are marked as deleted so that the deletion is synchronised across other iPads. They are then permanently removed from our server after 90 days.
- Daily usage limit logs for the custom template creation feature are automatically deleted after 2 days.

## Deleting data

Parents can delete data in the following ways:

- **Delete account:** Available on the profile page for signed-in accounts. This deletes the account, all paintings, statistics, templates, and files in our storage, as well as paintings stored on that iPad.
- **Sign out:** The app completes the backup process first, then removes paintings from that iPad. This prevents data from a shared iPad from being copied into another account. Parents will be warned if any data has not yet been backed up.
- **Guest Mode:** Deleting the app removes all data because we do not keep a copy.
- **By email:** Parents can also request data deletion by contacting littlecrewproject@gmail.com.

## Parents' rights

Parents or guardians have the right to view, request a copy of, correct, and delete their child's data, as well as withdraw their consent.

Send your request to littlecrewproject@gmail.com. We will respond within 7 business days.

Withdrawing consent means deleting the account.

## Security

Data is transmitted over HTTPS. Paintings are stored in private storage, and row-level security rules ensure that each account can only read its own data.

No system is completely secure. If a data breach affects users, we will notify them as required by applicable law.

## Changes to this policy

If there are significant changes to this policy, the app will display the Start screen again so parents can review the policy and provide their consent once more.

## Applicable law

This policy is governed by the laws of the Republic of Indonesia, including Law No. 27 of 2022 on Personal Data Protection.

## Contact

littlecrewproject@gmail.com  
Tangerang, Banten, Indonesia.
