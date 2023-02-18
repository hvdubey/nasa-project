const request = require('supertest');
const app = require('../../app');
const {
    mongoConnect,
    mongoDisconnect,
} = require('../../services/mongo');

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /v1/launches', () => {
        test('Pass case - 200', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
    
    describe('Test POST /v1/launches', () => {
        const completeLaunchData  = {
            mission: "ZTM159",
            rocket: "ZTM Experimental IS2",
            target: "Kepler-62 f",
            launchDate: "July 1, 2028"
        };
        const launchDataWithoutDate  = {
            mission: "ZTM159",
            rocket: "ZTM Experimental IS2",
            target: "Kepler-62 f",
        };
        const launchDataWithInvalidDate  = {
            mission: "ZTM159",
            rocket: "ZTM Experimental IS2",
            target: "Kepler-62 f",
            launchDate: "invalidDate"
        };
        test('Pass case - 201', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
        test('Missing required property', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Invalid request body',
            });
        });
        test('Invalid date', async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            });
        });
    });
});

