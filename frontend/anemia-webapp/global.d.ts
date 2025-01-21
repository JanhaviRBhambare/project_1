export { };

declare global {
    interface Window {
        watsonAssistantChatOptions?: {
            integrationID: string;
            region: string;
            serviceInstanceID: string;
            clientVersion?: string;
            onLoad?: (instance: any) => void;
        };
    }
}
