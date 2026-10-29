Action button; one primary per view, secondary for everything else, ghost for toolbar/low-emphasis.
```jsx
<Button icon="plus">Nuova idea</Button>
<Button variant="secondary" iconRight="arrow-right">Apri progetto</Button>
<Button variant="ghost" size="sm">Annulla</Button>
```
Sizes sm 28 / md 34 / lg 40px (use lg + fullWidth on mobile). Labels are sentence case, verb-first.
