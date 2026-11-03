## Purpose

Provides an unclipped visual feedback system for vessel card arrivals in the port dashboard carousel.

## ADDED Requirements

### Requirement: Unclipped Arrival Glow Animation
The vessel carousel SHALL allow the arrival glow animation to extend unclipped beyond container boundaries once the entry expansion completes.

#### Scenario: Vessel arrival glow animation execution
- **WHEN** a new vessel card (such as MSC BARCELONA) enters the radius and completes its width expansion
- **THEN** the wrapper overflow expands to visible and the card renders a full 3-blink neon ring glow without clipping
