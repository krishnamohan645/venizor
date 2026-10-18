# Motion review

Decision: Approve after browser verification.

| Area                | Review and observed result                                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Entrance            | Hero lines enter through masks; the intro completes before recording its session state. Animation was observed in a fresh session. |
| Scroll purpose      | Projects move horizontally while the scene stays at 24px from the viewport top. Process cards stay at their stacking offsets.      |
| Interruption        | Project navigation replaces the current scroll tween. Keyboard selection moves immediately. Native scrolling remains available.    |
| Performance         | New scroll choreography animates transforms and opacity. Process stacking uses native CSS sticky layout.                           |
| Responsive behavior | Mobile removes the long work pin and retains native swipe navigation and the selected project.                                     |
| Accessibility       | Reduced motion removes pinning, geometry movement, and spatial reveals. Continuous hero and footer motion have pause controls.     |
| Integration         | Form, dialog, search, project controls, and keyboard focus checks pass. No runtime or hydration errors were observed.              |
