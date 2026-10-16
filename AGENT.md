# AI CODING CONSTRAINTS & WORKFLOW RULES

1. **Strict Component Isolation:**
   - NEVER overwrite an entire page (`page.tsx`) when modifying UI features or components.
   - Always locate and edit the specific component file under `src/components/` (e.g., `src/components/workout/RestTimer.tsx`).
   - Leave container layouts and page wrappers untouched.

2. **Style & Asset Safety:**
   - NEVER modify `globals.css`, `tailwind.config.ts`, or global theme imports unless explicitly requested.
   - ALL SVGs and vector elements MUST reside inside strictly sized containers with fixed dimensions (e.g., `w-56 h-56`, `w-64 h-64`) and proper `viewBox` attributes.

3. **Pre-flight Build Verification:**
   - Before staging Git commits, always run a test build (`npm run build` or `npx next build`) to ensure 0 TypeScript or styling errors.
