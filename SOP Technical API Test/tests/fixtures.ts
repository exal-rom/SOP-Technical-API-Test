//Trying to use a fixture instead of auth.setup

import {test as base, expect} from '@playwright/test';

export const test = base.extend({
    token: async ({request}, use) => {
        const login = await request.post('/api/login',{
            data: {
                email: 'eve.holt@reqres.in',
                password: 'cityslicka'
            }
        });

        const status = login.status();
        const contentType = login.headers()['content-type'] || '';

        //If the API rturned HTML,fail gracefully...
        if(!contentType.includes('application/json')) {
            console.log('Login did not return JSON');
            console.log('Status:', status);
            console.log('Content-type:', contentType);
            await use(null);
            return;
            }

        const {token} = await login.json();
        await use(token);
        }
    });

export {expect};