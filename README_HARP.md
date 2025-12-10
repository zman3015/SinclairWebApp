# HARP X-Ray Inspection Form

## Overview

The HARP X-Ray Inspection Form is a comprehensive multi-step form for conducting X-ray equipment inspections according to HARP (Healing Arts Radiation Protection) standards.

## Accessing the Form

### Option 1: Through Main Portal (Requires Login)

1. Navigate to the login page
2. Use demo credentials:
   - **Admin:** admin@alphadent.com / admin123
   - **User:** user@alphadent.com / user123
3. Click on "HARP Inspections" in the navigation menu
4. Or navigate directly to: `/harp-inspections/new`

### Option 2: Direct Access Test Page (No Login Required)

Navigate to: `/harp-inspections/new` (if authentication is bypassed for testing)

## Form Structure

The form consists of 5 steps:

### Step 1: Test Setup
- **Test Type:** HARP QA, New Install, Acceptance Test, Plans Approved, or Replacement
- **X-ray Types:** Intra-oral, Pan, Ceph, CT (multiple selection)
- **Clinic Information:**
  - Name, Address, Phone
  - Account Number, Room Number
  - Inspection Date
- **Technician Information:**
  - Technician Name, Date

### Step 2: Equipment Information
- Equipment Make and Model
- Control Serial Number
- Tube Serial Number
- XRIS Number
- Image Type: Film, Digital, or Phosphor Plate

### Step 3: Inspection Items 1-12
Each item can be marked as:
- **MS** (Meets Specifications) - Green
- **NI** (Needs Improvement) - Red

Items include:
1. Line "ON" indicator
2. X-ray "ON" indicator
3. Multiple tube indicators
4. Line voltage compensator
5. kV / mA / Technique indication
6. Tube head leakage
7. Tube head stability
8. Interlocks
9. Labels
10. Warning Signs
11. Exposure Switch
12. kVp accuracy

### Step 4: Test Parameters and Results
- **Dynamic Table** with add/remove rows functionality
- Columns:
  - Source to Cone Tip Distance
  - Set kV, mA, Time
  - Measured kVp, Time, Output (mR)
  - P-E-E Average MR
- **Notes** section for additional comments

### Step 5: Final Inspection Items & HVL

**Items 13-17** (MS/NI):
- H-V-L (Filtration)
- Collimation pan
- Patient exposure entrance
- Output reproducibility
- Timer: (mech/elect)

**Items 18-20** (Yes/No):
- kV +/-8%
- Time +/-10%
- Meet H.A.R.P. Specifications

**Items 21-23** - P.E.E. Values:
- kV, mA, sec (numeric inputs)

**Item 24:**
- Beam Alignment (text input)

**Half Value Layer (HVL):**
- kV, mA, Time, mR
- Total Filtration (mm Al)
- Measured HVL (mm)
- Required HVL (mm)

## Form Validation

The form uses **React Hook Form** with **Zod** validation:

- All required fields are marked with *
- Step navigation is controlled (Previous/Next buttons)
- Final step has "Generate PDF Report" button
- Validation errors display in red below fields

## PDF Generation

When the form is completed:

1. Click "Generate PDF Report" on Step 5
2. The system sends form data to `/api/harp-inspection/pdf`
3. A PDF is generated using **pdf-lib**
4. The PDF automatically downloads with filename:
   `HARP-Inspection-{AccountNumber}-{Date}.pdf`

### PDF Contents

The PDF includes:
- Test Type and Clinic Information
- Equipment Details
- All inspection items with results (MS/NI/Yes/No)
- Test parameters table
- Notes
- P.E.E. values and beam alignment
- Half Value Layer measurements
- Technician information
- Regulatory notice footer

## Technical Implementation

### File Structure
```
dental-tech-portal/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── harp-inspection/
│   │   │       └── pdf/
│   │   │           └── route.ts         # PDF generation API
│   │   └── harp-inspections/
│   │       └── new/
│   │           └── page.tsx             # Form page
│   ├── lib/
│   │   └── harp-types.ts                # TypeScript types
│   └── components/
│       └── ui/                          # shadcn components
```

### Dependencies

```json
{
  "react-hook-form": "^7.68.0",
  "zod": "^4.1.13",
  "@hookform/resolvers": "^5.2.2",
  "pdf-lib": "^1.17.1",
  "@radix-ui/react-radio-group": "^1.3.8",
  "@radix-ui/react-checkbox": "^1.3.3"
}
```

### Type Definitions

All types are strongly typed in `src/lib/harp-types.ts`:
- `HarpTestType`
- `XrayType`
- `MsNiResult`
- `YesNoResult`
- `ImageType`
- `HarpItemCheck`
- `HarpTechniqueRow`
- `HarpHalfValueLayer`
- `HarpInspectionForm`

## Mobile Responsiveness

The form is fully responsive:
- Step progress indicator adapts on mobile
- Tables scroll horizontally on small screens
- Grid layouts collapse to single column
- Touch-friendly buttons and inputs

## Build Status

✅ **Build Successful**
- No TypeScript errors
- No ESLint errors (1 minor warning unrelated to HARP form)
- All components properly typed
- Form validation working
- PDF generation functional

## Testing Checklist

- [ ] Fill out all 5 steps
- [ ] Test form validation (try submitting with empty required fields)
- [ ] Test dynamic table (add/remove rows in Step 4)
- [ ] Test MS/NI toggles (Steps 3 & 5)
- [ ] Test Yes/No toggles (Step 5)
- [ ] Generate PDF and verify all data appears correctly
- [ ] Test on mobile device
- [ ] Verify PDF downloads with correct filename

## Future Enhancements

Potential improvements:
- Save form as draft in Firebase
- Load previous inspections
- Email PDF to clinic
- Digital signature capture
- Photo upload capability
- Historical comparison reports
- Integration with equipment database

## Support

For questions or issues:
- Check the console for error messages
- Verify all required fields are filled
- Ensure you're using a modern browser
- Contact support@same.new for technical assistance
