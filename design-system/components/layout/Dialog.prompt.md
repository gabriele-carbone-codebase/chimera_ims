Modal for focused tasks (new idea, confirm stage change); scrim click closes.
```jsx
<Dialog open={o} title="Nuova idea" onClose={()=>setO(false)} footer={<><Button variant="ghost">Annulla</Button><Button>Salva</Button></>}>…</Dialog>
```
