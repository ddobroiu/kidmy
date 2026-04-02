import axios from 'axios';

interface OblioConfig {
    cif: string;
    email: string;
    secret: string;
    series?: string;
}

interface InvoiceItem {
    name: string;
    code?: string;
    description?: string;
    price: number;
    quantity: number;
    measuringUnitName: string;
    currency: string;
    vatName: string;
    vatPercentage: number;
    productType?: string; // Serviciu / Produs
}

interface InvoiceClient {
    cif?: string;
    name: string;
    rc?: string;
    code?: string;
    address: string;
    state: string;
    city: string;
    country: string;
    email?: string;
    phone?: string;
    save: boolean;
}

interface CreateInvoiceParams {
    currency: string;
    language: string;
    issueDate: string;
    dueDate: string;
    products: InvoiceItem[];
    client: InvoiceClient;
    seriesName?: string;
    precision?: number;
    useStock?: boolean;
}

export class OblioService {
    private config: OblioConfig;
    private token: string | null = null;
    private tokenExpiry: number = 0;

    constructor() {
        this.config = {
            cif: process.env.OBLIO_CIF_FIRMA || '',
            email: process.env.OBLIO_CLIENT_ID || '',
            secret: process.env.OBLIO_CLIENT_SECRET || '',
            series: process.env.OBLIO_SERIE_FACTURA || 'KID',
        };
    }

    private async getAccessToken(): Promise<string> {
        if (this.token && Date.now() < this.tokenExpiry) {
            return this.token;
        }

        try {
            const response = await axios.post('https://www.oblio.eu/api/authorize/token', {
                cif: this.config.cif,
                client_id: this.config.email,
                client_secret: this.config.secret,
            });

            this.token = response.data.access_token;
            const expiresIn = response.data.expires_in || 3600;
            this.tokenExpiry = Date.now() + (expiresIn * 1000) - 60000;

            return this.token!;
        } catch (error: any) {
            console.error('Oblio Auth Error:', error.response?.data || error.message);
            throw new Error('Failed to authenticate with Oblio');
        }
    }

    async createInvoice(params: CreateInvoiceParams) {
        const token = await this.getAccessToken();

        if (!params.seriesName && this.config.series) {
            params.seriesName = this.config.series;
        }

        try {
            const response = await axios.post(
                'https://www.oblio.eu/api/docs/invoice',
                {
                    cif: this.config.cif,
                    client: params.client,
                    issueDate: params.issueDate,
                    dueDate: params.dueDate,
                    currency: params.currency,
                    language: params.language,
                    products: params.products,
                    seriesName: params.seriesName,
                    precision: params.precision || 2,
                    useStock: params.useStock || false,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data.data;
        } catch (error: any) {
            console.error('Oblio Create Invoice Error:', error.response?.data || error.message);
            throw error;
        }
    }
}

export const oblioService = new OblioService();
