// components/backend/firebaseAdmin.ts

import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: 'asyouwish-57228',
      clientEmail: 'firebase-adminsdk-i18rj@asyouwish-57228.iam.gserviceaccount.com',
      privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDIah8wupaO0WmO\nrp/T2f7+KplbBihLBadGi6noVULqOEs7kRgN06nP9dq8Acd2NPAvTpLKQ4Wki2v3\nfZR+dzPcEdmeUoxK71el6UtbgmejMtaiDcnOHm49On8PTNKR3Cwt+0nDwR8yCzXO\nPj+3hB24FVHJdVAJb5ND0JVOzl4tviVMghxP7IFBv91glvCpN/ZDxeXXX5Fs0nqr\nHtJ/FG88gYu0Vaq9XmdSmRFwl12JtuZPNhjGE+rnvGr9uXE7hXvhxaGo5qlk8Bk0\nHXJwx84fjkh/wXucWxnO9NeODYiYt1XXATgCl2jdV4X92E29NWs/dM7Ie/W6Dh4f\n+eUjwxF/AgMBAAECggEABsx3Qb0mO+uefaUuppycO8EQo9tMnfUhseZmVmDLZ4w5\njna/tdBeQc4ZpESnLsl9nptwGAWRtES4wbB0WbEL9oxyP1d5xACPOWUSFeyDWYXU\nwl0JKIiKL0XGLlaUtoxyiB4ghJcrkaJ6m8tHsWZg9Qx8GXUfrEliIPpAH0vu5bxL\nIcg4Vi9653+XTjtNYohTjwNP8Cr0QLpPVYbfeipNfOPDM6Nscxb4l154EbquCFmD\nW/NxbopxB86/OHuQqBgfHP/TJOztFZOZ6gWI7y5GQ5PrKDddI3csvUazj7nXcRds\n8e3yjzq2LkuGStQ/CCd3E7DA7MPJG+5s4KOwBPM/WQKBgQD6cEAOoapKo/tkJDhm\n5hGwlwn/gbLKOh23kJ5QhCKAkct7gcDEFH35PEndzs9dTBMhjR/d9OobhohhkWHf\nYu1xvBxAXmdCvm9IZAGKCFOhHrRLXp55otRKJSPdDXr18S4UZCpkgEGLM1iiqYYN\nupfHbUDdLWIis2qlcBgMkoeLfQKBgQDM3XvvB7lrdX+Fuwn/4o3h2nZyB+k/F1ag\ntK/o8aS1MtNtptkB50osPAHPXcHwNMmIRwqySqI3Ao0vECIPmf3boEnuZuFGm165\n+vGQYMQZ9PhhSvcR3zybSHCUboZPOUPbAKm1ZY43Nc6CYpN3K9h3gnABgCayci01\n7pk2xk+JqwKBgBYZR53C6Drz41//zjZOQOtbOJeiQzuTC0JCcaXbMwwzUUhRt8fV\noxQWHNKEyEmMR/fi8xfr36iUI36wjHlgymEJ31hSvDvof/tcT8J1X6PNCM3JyKQl\nGSR9yH9eDCadpJpKCG+b3azB2CVqXhjiCTigzGN3+LvlJxj4Hjclyu4lAoGAGAt2\n3Fs/vAkSapPFXK8uj++gL0oWaj1HAZ2zd9fEyS+p+Ri4J60J258/ZyNN++92J/SO\noNZ5q5M1Fu0B0mr0jK6Hft+8WRkrSRDXAWcaHSHPdTvjO8nDx0X9UK6YPPwvpqix\nQoUk5/38uvju7fHLelto4gQ0hoU4IThb6z3jX/kCgYBASb5YDdSzcp6ncS4VP2iH\nXN9gSn479iDKbRNMJno6ueLVoUoSyCD2TbrzCxzgrxPlOnp1ooDcjvv3OF9aq6vS\nWd+FWXA6jW4pnmX/WJNqfF/9j02Lf7+UykgkJtz1wgZi9487AiwGGhwrmRH8aLm1\nWexQU9ldzeTfX/jHnRCnLg==\n-----END PRIVATE KEY-----\n'.replace(/\\n/g, '\n'),
    }),
  });
}

export { admin };
