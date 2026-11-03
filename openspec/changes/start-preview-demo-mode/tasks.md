## 1. CSS Animations & Visual Assets

- [x] 1.1 Verify keyframe animations in `src/index.css` for card slide-in and alert badge pulsing.

## 2. Preview State & Start Preview Button Hiding

- [x] 2.1 Ensure `[▶ Start Preview]` UI button in `UnifiedDashboard.tsx` map header hides immediately (`!isPreviewActive`) upon click.

## 3. Realistic Sea Channel Trajectory & Dynamic Heading Rotation

- [x] 3.1 Implement Quadratic Bezier sea curve interpolation in `UnifiedDashboard.tsx` from open Mediterranean Sea (`[41.310, 2.235]`) through fairway curve (`[41.338, 2.215]`) to port entrance (`[41.358, 2.192]`).
- [x] 3.2 Compute dynamic tangent heading angle ($\theta$) at each frame to rotate the ship marker icon along the navigation trajectory.
- [x] 3.3 Add pulsed alert badge overlay on the vessel map icon and trigger left-to-right slide-in animation for the approaching vessel card when crossing the radius boundary.
- [x] 3.4 Render bottom-right glassmorphism floating notification card displaying "Automatic allocation is creating using AI agents..." and a "View Allocation" button.

## 4. Seamless Modal Presentation (Eliminating Blank Screen Flash)

- [x] 4.1 Update `App.tsx` and `UnifiedDashboard.tsx` so clicking "View Allocation" opens `ResourceAllocationModal` directly over the dark Live Map layout with backdrop blur, eliminating light-theme background flashes.

## 5. Live AI Agent Reasoning Stream in Modal

- [x] 5.1 Verify dynamic `AIAgentActivityStream` console inside `ResourceAllocationModal` (`ResourceAllocation.tsx`) renders live animated agent reasoning steps leading up to allocation completion.
