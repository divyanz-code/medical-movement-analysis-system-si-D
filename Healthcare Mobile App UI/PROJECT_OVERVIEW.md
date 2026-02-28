# Medical Movement Analysis - Mobile App UI

A premium, clinical-grade mobile healthcare application for movement analysis and assessment tracking.

## 🎨 Design System

### Color Palette
- **Primary**: Deep Navy (#1a1f36) - Clinical authority and trust
- **Accent**: Clinical Teal (#0891b2) - Medical precision and technology
- **Success**: Green (#10b981) - Positive outcomes and progress
- **Warning**: Orange (#f59e0b) - Compensation detection
- **Destructive**: Red (#ef4444) - Critical alerts

### Typography
- Modern, legible font stack optimized for medical data
- WCAG AAA compliant contrast ratios
- Supports dynamic type/font scaling for accessibility

### Components
- **MetricCard**: Display key movement metrics with icons and trends
- **StatusChip**: Visual status indicators (Aligned, Compensatory, Warning, etc.)
- **RecordButton**: Large, animated recording control with pulse feedback
- **AngleVisualizer**: SVG-based joint angle visualization
- **SessionCard**: Assessment history card with comparison data
- **EmptyState**: Helpful empty state with icons and CTAs

## 📱 App Structure

### Authentication Flow
1. **Splash Screen** - Animated logo and app loading
2. **Welcome** - Value proposition with feature highlights
3. **Sign Up** - Account creation with validation
4. **Login** - Email/password + biometric options
5. **Forgot Password** - Email-based password reset

### Main Application
1. **Home Dashboard**
   - Latest assessment score with trend
   - Quick action: New Assessment
   - Key metrics display (ROM, Max Angle)
   - Progress trend chart (Recharts)
   - Recent sessions list

2. **Assessment Setup**
   - Joint selection (Knee, Shoulder, Hip, Elbow, Ankle)
   - Task selection (Flexion, Extension, Squat, Rotation)
   - Step progress indicator
   - Smart validation

3. **Camera Recording**
   - Live camera feed with overlay
   - Real-time joint tracking visualization
   - Angle measurements and ROM calculation
   - Alignment status indicators
   - Recording controls (capture, torch, flip)
   - 5-15 second recording duration

4. **Video Preview**
   - Playback before upload
   - Option to re-record

5. **Upload & Processing**
   - Progress indicators for upload and AI analysis
   - Multi-step processing feedback
   - Smooth transition to results

6. **Results Screen**
   - Movement score with circular progress
   - Key metrics breakdown (Min/Max Angle, ROM)
   - Compensation warnings with clinical notes
   - Movement insights (Fluidity, Control, Symmetry)
   - Share and download options

7. **Assessment History**
   - Searchable list of all assessments
   - Filter by joint type
   - Session cards with date, score, ROM
   - Empty state for new users

8. **History Detail**
   - Complete session data
   - Comparison with previous assessment
   - Clinical notes
   - Action buttons

9. **Profile**
   - Personal information display
   - Medical profile (affected limb)
   - Assessment statistics
   - Quick actions

10. **Edit Profile**
    - Full form with validation
    - Age, gender, affected limb selection
    - Onboarding flow support

11. **Settings**
    - Notification preferences
    - Dark mode toggle
    - Units selection (Metric/Imperial)
    - Privacy & security links
    - Help & support
    - Sign out with confirmation

### Utility Screens
- **Offline** - Network error with retry
- **Permission Denied** - Camera access instructions
- **Design System** - Component showcase and documentation

## 🎯 Key Features

### Medical-Grade UX
- Clinical color palette for trust and credibility
- Large touch targets (44x44pt minimum)
- Clear visual hierarchy for critical data
- Status indicators use color + icons (not color alone)

### Accessibility
- WCAG 2.1 Level AA compliant
- Supports dynamic font scaling
- High contrast ratios for all text
- Descriptive labels and semantic HTML
- Keyboard navigation support

### Animations & Interactions
- Motion components for smooth transitions
- Recording pulse animation
- Result reveal animations
- Button press feedback
- Skeleton loading states

### Data Visualization
- Recharts for trend analysis
- SVG-based angle visualizers
- Circular progress indicators
- Color-coded status displays

## 🛠 Technology Stack

- **Framework**: React 18.3
- **Router**: React Router 7 (Data mode)
- **Styling**: Tailwind CSS v4
- **Animation**: Motion (Framer Motion)
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form

## 📊 Mock Data Structure

```typescript
interface Assessment {
  id: string;
  userId: string;
  date: string;
  jointType: string;
  taskType: string;
  minAngle: number;
  maxAngle: number;
  rom: number;
  movementScore: number;
  compensationDetected: boolean;
  videoUrl?: string;
  notes?: string;
}
```

## 🚀 Routes

- `/` - Splash screen
- `/welcome` - Welcome/onboarding
- `/signup` - Registration
- `/login` - Authentication
- `/forgot-password` - Password reset
- `/home` - Main dashboard
- `/assessment` - Assessment setup
- `/camera` - Recording screen
- `/preview` - Video preview
- `/upload` - Upload progress
- `/results/:id` - Assessment results
- `/history` - All assessments
- `/history/:id` - Assessment detail
- `/profile` - User profile
- `/edit-profile` - Edit user data
- `/settings` - App settings
- `/offline` - Offline state
- `/permission-denied` - Camera permission
- `/design-system` - Component library

## 💡 Design Principles

1. **Clinical + Human**: Professional medical aesthetic with warm, approachable UX
2. **Data-Driven**: Clear metrics and trends for objective progress tracking
3. **Guidance-First**: Helpful overlays, tips, and feedback throughout
4. **Accessible**: High contrast, large targets, screen reader support
5. **Mobile-Optimized**: Touch-friendly, responsive, safe area aware

## 🎨 Component Variants

### Buttons
- Primary (filled)
- Secondary (subtle)
- Outline (border)
- Ghost (transparent)
- Destructive (red)
- Sizes: sm, default, lg

### Cards
- Default (white background)
- Accent (teal tint)
- Success (green tint)
- Warning (orange tint)

### Status Chips
- Aligned (green)
- Compensatory (orange)
- Warning (red)
- Success (green)
- Processing (teal)

## 📱 Responsive Behavior

- Mobile-first design (375px - 428px optimal)
- Supports tablet layouts (768px+)
- Max content width: 448px (md)
- Safe area insets for modern devices
- Touch-optimized interactions

## 🔒 Privacy & Security Notes

- Camera access only during recording
- Secure video upload (simulated)
- Data encryption mentioned in UI
- HIPAA compliance messaging
- Clear privacy policy access

## 🎯 Production Readiness

✅ Complete design system with reusable components
✅ Consistent naming and file structure
✅ Auto-layout and responsive design
✅ Accessibility best practices
✅ Loading and error states
✅ Form validation
✅ Navigation flow logic
✅ Mock data for demonstration
✅ Animation and micro-interactions
✅ Dark mode support (togglable)

## 🎨 Figma Handoff Ready

All components use:
- Consistent spacing (4px, 8px, 12px, 16px, 24px, 32px)
- Standard border radius (0.75rem = 12px)
- Defined color tokens
- Typography scale
- Component variants
- Named layers and frames

## 📝 Notes

This is a frontend prototype with simulated backend functionality. In production:
- Camera would use actual device camera API
- Video upload would connect to secure cloud storage
- AI analysis would process via backend API
- User auth would use OAuth/JWT tokens
- Data would persist in secure database (consider Supabase for backend)
