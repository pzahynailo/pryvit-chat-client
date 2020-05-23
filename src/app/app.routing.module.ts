import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './services/auth/auth-guard.service';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
        canActivate: [ AuthGuard ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./authentication/authentication.module')
            .then(m => m.AuthenticationModule)
    }
]

/** Routing for the root AppModule. */
@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {
}
