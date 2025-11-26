# Projects Portfolio Setup Guide

## Adding New Projects

To add a new project to the portfolio:

1. **Edit `/lib/data/projects.ts`**
   - Add a new project object to the `projects` array
   - Each project should have:
     ```typescript
     {
       id: 10, // Unique ID (increment from last project)
       name: 'Project Name',
       category: 'Category Name',
       description: 'Short description',
       fullDescription: 'Longer description for the project detail page',
       gradient: 'from-color-500 to-color-500', // Tailwind gradient classes
       tags: ['Tag 1', 'Tag 2', 'Tag 3'],
       year: '2024',
       images: [
         '/images/projects/project-name/1.jpg',
         '/images/projects/project-name/2.jpg',
         '/images/projects/project-name/3.jpg',
       ],
       client: 'Client Name',
       services: ['Service 1', 'Service 2'],
     }
     ```

2. **Add Project Images**
   - Create a folder: `/public/images/projects/project-name/`
   - Add images named: `1.jpg`, `2.jpg`, `3.jpg` (or more)
   - Update the `images` array in the project data to match your file paths
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

## Image Organization

Recommended folder structure:
```
/public/images/projects/
  ├── zapier/
  │   ├── 1.jpg
  │   ├── 2.jpg
  │   └── 3.jpg
  ├── roland/
  │   ├── 1.jpg
  │   ├── 2.jpg
  │   └── 3.jpg
  └── project-name/
      ├── 1.jpg
      ├── 2.jpg
      └── 3.jpg
```

## Image Guidelines

- **Recommended size**: 1200x1200px minimum (square) or 1920x1080px (landscape)
- **Format**: JPG or PNG
- **File size**: Keep under 500KB per image for optimal performance
- **Naming**: Use lowercase, hyphen-separated names (e.g., `project-name`)

## Updating Existing Projects

To update an existing project:
1. Find the project in `/lib/data/projects.ts`
2. Update any fields (name, description, images, etc.)
3. The changes will automatically reflect on both the portfolio page (`/work`) and the project detail page (`/work/[id]`)

## Project Categories

Current categories:
- Brand Identity
- Product Design
- Platform Design
- Healthcare
- Food & Beverage
- Health & Fitness
- Web Design
- Logo Design

Add new categories as needed - they'll automatically appear in the filter (when filtering is implemented).

## Notes

- The project detail page will show a gradient placeholder if images don't exist yet
- Images are lazy-loaded for better performance
- The system automatically handles missing images with fallback displays

