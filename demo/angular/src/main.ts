import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './demo/demo.module';

platformBrowserDynamic().bootstrapModule( AppModule )
	.catch( err => console.log( err ) );
