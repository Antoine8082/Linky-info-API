'use strict';

import fetch from 'node-fetch';

const topics = {

    'papp': {
        name: 'Instant consumption',
        unit: 'VA',
    },

    'iinst': {
        name: 'Instant intensity',
        unit: 'A',
    },
};

const credentials = {

    username: 'ManonAntoine',
    password: 'Sandman0303',
};

const lastValues = {};

async function fetchPowerData() {

    const base64Credentials = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');

    try {

        const response = await fetch('http://192.168.1.25/power', {

            headers: {
                'Authorization': `Basic ${base64Credentials}`,
            },
        });

        if (!response.ok) {

            console.error('API response error:', response.statusText);
            return;
        }

        const data = await response.json();
        const now = new Date();
        const timeString = now.toLocaleTimeString();

        for (const key in topics) {

            if (data.hasOwnProperty(key)) {

                const topicInfo = topics[key];
                const value = data[key];

                if (lastValues[key] !== value) {

                    console.log(`[${timeString}] ${topicInfo.name}: ${value} ${topicInfo.unit}`);
                    lastValues[key] = value;
                }
            }
        }
    } catch (error) {

        console.error('Error retrieving data from API:', error);
    }
}

const updateInterval = 1000;

setInterval(fetchPowerData, updateInterval);


fetchPowerData();
