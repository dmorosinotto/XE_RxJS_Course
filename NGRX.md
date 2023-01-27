# MATERIALE PER NGRX

-   Workshop Michael [video](https://www.youtube.com/watch?v=XKfhGntZROQ) / demo [stackbliz](https://stackblitz.com/edit/rxjs-operating-heavily-dynamic-uis-cshhxz?file=_index.ts) + [slides](https://bitly.com/rxjs-operating-heavily-dynamic-uis_slides) che mostra **MENTAL MODEL:** _EventSource+CQRS = **STATE MANAGEMENT**_ che è l'approccio che sta alla base anche di Redux "Flux architecture" -> ![NGRX](https://ngrx.io/generated/images/guide/store/state-management-lifecycle.png)

Guardare: [Intro/Training a **NGRX** ThisDot](https://www.youtube.com/watch?v=iWX7qCGVt9U) by Mike Ryan + [repo codice](https://github.com/thisdot/ngrx-training)

Concetti Pricipali: per una prima intro potete vedere [corso ThisIsLearning](https://this-is-angular.github.io/ngrx-essentials-course/docs/chapter-1) anche se non è completissimo/aggiornato ha un approccio passo-passo x esempi.

Concetti Pricipali:

-   **ACTION** video su [Action hygiene](https://youtu.be/JmnsEvoy-gY?t=1021) by Mike
    DOMANDE:

    -   perchè suggeriscono di NON riutilizzare azioni e crearne una di nuovo per ogni page/comp formato `"[sorgente] evento"`
    -   R: facilita tracking + gestione effect, ma alla fine abbiamo 1000+ di ACTION che identificano il nostro processo passo/passo -> flusso azioni
    -   _NON PIU' ACTION=method call(par)_ ma **UNIQUE EVENT**
    -   NON fare Action troppo generiche...=> RISULTATO BOILERPLATE!!!

-   **SELECTOR** [vecchio](https://www.youtube.com/watch?v=Y4McLi9scfc) video con Todd & David
    CONSIGLIO: usare sempre createSelector -> ottimizzazione distinctUtilChange + memoization (shareReplay)
-   **REDUCER**: Pure function + Immutability per alterare state
    ATTENZIONE DEVONO ESSERE SINCRONI!
    DOMANDE: Ma vi siete chiesti:

            -   perchè dovete tornare switch(action) -> default: return state?
            -   ogni action quanti/quali reducers raggiunge?
            -   perchè dovete usare Immutability per alterare stato

-   **EFFECT**
    Gestione Side-effect: codice asyncrono + processi elaborazione/evoluzione stato come sequenza Azioni in->out

    _ATTENTI_ a non generare errori -> Gestire azioni per caso Error oppure far si che lo stream di Actions non termini!

-   Ricordatevi che in ogni APP avete una sorgente di state globle implicita che è l'**URL DEL BROWSER** -> Router -> date un occhiata a [@ngrx/router-store](https://ngrx.io/guide/router-store)

-   Per _"Ridurre Boilerplate"_ -> decidere **cosa mettere nello State**: [SHARI](https://youtu.be/t3jx0EC-Y3c?t=541) video by Brandan Roberts + Mike

-   La [sintassi nuova](https://dev.to/ngrx/you-should-take-advantage-of-the-improved-ngrx-apis-1a84) introdotta su NGRX14 semplifica l'uso e magari unito a Standalone component con [provideStore/Effect](https://dev.to/ngrx/announcing-ngrx-v15-standalone-apis-type-safe-projectors-component-and-componentstore-updates-and-more-l7) migliore un pò la quantità di codice/semplifica gestione...

# MY 2 CENTS:

LE VERE DOMANDE CHE DOVRESTE FARVI:

-
-   Avete veramente bisogno di Tracing Undo/redo Time travel?
-   Aveve veramente bisogno di gestire tutto come STATE GLOBALE
-   Siete pronti a scrivere codice Immutable (per i Reducer)
-   E modellare l'INTERA applicazione esternalizzando il codice dai componenti
-   E gestire ogni elaborazione come sequenza / catena di azioni usando gli Effect?

> Prima di adottare uno "StateManagemnt" in modo mssivo dovreste Capire cosa vuol dire fare "StateManagement" e valutare le alternative che avete a disposizione capendo i trade-off/complicazioni che ogni soluzioni si porta dietro/impone!

MY 2 CENTS:
PS: Io _"NON AMO NGRX"_ per tutto questa architettura / "complicazioni" e se potessi sceglierei, userei alternative come: [Akita](https://opensource.salesforce.com/akita/) molto più semplice da usare e con approccio **"[DB LIKE](https://netbasal.com/working-with-normalized-data-in-akita-e626d4c67ca4)"** che semplifica molto gestione delle _[Entity](https://opensource.salesforce.com/akita/docs/entities/entity-store)_ con molti helper per gestire _[Cache(TTL)](https://opensource.salesforce.com/akita/docs/additional/cache) / [Active](https://opensource.salesforce.com/akita/docs/entities/active) / [loading](https://opensource.salesforce.com/akita/docs/additional/operators) / [UIstate](https://opensource.salesforce.com/akita/docs/ui) / [transaction](https://opensource.salesforce.com/akita/docs/transactions) / [paginazione](https://opensource.salesforce.com/akita/docs/plugins/pagination) / [local state](https://opensource.salesforce.com/akita/docs/angular/local-state)..._

-   Oppure valuterie seriamente approccio **COMPONENT-STATE** casomai con [RxAngular](https://www.rx-angular.io/) vedi questo [BELLISSIMO VIDEO INTRO](https://www.youtube.com/watch?v=CcQYj4V2IKw) che guarda caso è la base di quanto visto nel video di Michael (PS: indovinate chi è l'autore di **@rx-angular/state**)
-   Che poi adesso è stato scopiazzato anche in [@ngrx/component-store](https://ngrx.io/guide/component-store/comparison) ma quello originale di Michael è [fatto meglio](https://github.com/rx-angular/rx-angular)!
-   TRICK: Non tutto @ngrx è da buttare ad esempio **VI CONSIGLIO** di usare **@ngrx/component** al posto del _PROBLEMATICO:_ `*NgIf="obs$ | async as val"`\_ **USATE ->[\*ngrxLet](https://ngrx.io/guide/component/let)** oppure [| ngrxPush](https://ngrx.io/guide/component/push)
