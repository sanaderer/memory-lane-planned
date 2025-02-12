# Memory Lane

Memory Lane is a web application designed to help users create, store, and share their cherished memories with friends and family. This platform allows users to organize their memories chronologically, providing a structured way to relive past moments in an intuitive and visually appealing format.

## Features

- **User Selection**: Users can choose a profile to access their memory lane.
- **Memory Lane**: Displays a chronological collection of events.
- **Memory Cards**: Each event includes a title, description, timestamp, and at least one image.
- **Sorting & Filtering**: Users can sort memories by date and filter them by time periods.
- **Memory Details & Editing**: Users can view detailed information about a memory and update or delete it.
- **Memory Creation**: Users can add new memories with a title, description, date, location, and image upload functionality.
- **Sharing**: Users can copy and share their memory lane URL with others.
- **Error Handling**: A custom 404 page ensures smooth navigation.

## Tech Stack & Justification

### **Framework & Language**

- **Next.js (App Router)**: Chosen for its improved performance with server components, simplified routing, and built-in optimizations.
- **TypeScript**: Provides type safety and improves maintainability, reducing potential runtime errors.

### **Styling & UI**

- **Tailwind CSS**: Enables rapid development with utility-first styling, ensuring a clean and consistent design.
- **ShadCN**: Provides accessible and well-designed UI components, improving development speed.
- **Framer Motion**: Used for smooth animations, enhancing user experience.

### **State Management & API**

- **Zustand**: A lightweight and flexible state management library that simplifies global state handling.
- **Next.js Services**: Utilized for API handling, ensuring a streamlined backend structure directly within the Next.js app.

### **Backend & Storage**

- **Supabase (Postgres & Storage)**: Selected for its ease of use, scalability, and native support for Postgres and file storage.

## Future Improvements

While the current implementation covers the core functionality, there are several enhancements that could be introduced:

- **Multiple Image Uploads**: Currently, only one image is supported per memory. Adding support for multiple images would improve the experience.
- **Infinite Scrolling/Pagination**: Instead of loading all memories at once, implementing infinite scrolling or pagination would improve performance.
- **User Authentication & Privacy Controls**: Right now, any user can access memory lanes. In the future, adding authentication and privacy settings would enable users to manage public and private lanes.
- **Social Features**: Features like liking or commenting on memories could improve user engagement.
- **Improved Design & UX Enhancements**: Adding animations, transitions, and other visual enhancements would improve the user experience.


## Installation & Running the Project

1. Clone this repository:

   ```sh
   git clone https://github.com/your-github-username/memory-lane.git
   cd memory-lane
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Run the API:

   ```sh
   npm run serve:api
   ```

4. Start the development server:

   ```sh
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`.

## Project Structure

```
/memory-lane
├── components
│   ├── layout (Layout components)
│   ├── memory (Memory components)
│   ├── ui (Reused UI elements like buttons, modals, etc.)
│   ├── user (User components)
├── app
│   ├── users
│   │   ├── [userId].tsx (User Memory Lane Page)
│   │   ├── _layout.tsx (Root Layout)
│   ├── _layout.tsx (Root Layout)
│   ├── not-found.tsx (404 Page)
│   ├── page.tsx (Home Page - User Selection)
├── hooks (Custom hooks)
│   ├── useMemoryEdit.ts (Memory editing hook)
│   ├── useQueryParams.ts (Query params hook)
│   ├── use-toast.ts (Toast hook)
├── lib
│   ├── services (API calls and data handling)
│   ├── supabase (Supabase client initialization)
│   ├── utils (Helper functions)
│   ├── validations (Validation functions)
├── store (State management - Zustand)
├── public (Static assets)
└── styles (Global styles)
```

## Screenshots

<video width="640" height="360" controls>
  <source src="./public/screen-capture.mov" type="video/mp4">
  Your browser does not support the video tag.
</video>

## API Updates

The API has been modified to:

- Support creating, retrieving, updating, and deleting memories.
- Store images in Supabase Storage and metadata in Supabase Postgres.
- Handle user data retrieval.
- Utilize Next.js service functions for efficient backend operations.

## Notes

- Authentication is **not** required for this iteration.
- The mockup provided was used as inspiration, with UX improvements added.
- Users can interact with the platform without persistent login.

## Deployment

The project is deployed on **Vercel**, making it accessible for easy testing and review.

---

Thank you for reviewing my submission! 🚀
