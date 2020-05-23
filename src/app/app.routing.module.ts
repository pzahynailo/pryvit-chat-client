import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./authentication/authentication.module')
            .then(m => m.AuthenticationModule)
    }
]

/** Routing for the root AppModule. */
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
