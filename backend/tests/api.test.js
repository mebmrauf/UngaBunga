import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';

describe('API Endpoints', () => {

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should return API Working on GET /', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe('API Working');
    });

    it('should fetch product list on GET /api/product/list', async () => {
        const res = await request(app).get('/api/product/list');
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.products)).toBe(true);
    });

});
