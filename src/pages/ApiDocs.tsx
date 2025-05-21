import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

interface ApiSpec {
    paths: {
        [path: string]: {
            [method: string]: {
                summary: string;
                description: string;
                parameters?: Array<{
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        $ref?: string;
                    };
                    description: string;
                }>;
                requestBody?: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref?: string;
                                type?: string;
                                properties?: Record<string, any>;
                            };
                            example?: any;
                        };
                    };
                };
                responses: {
                    [status: string]: {
                        description: string;
                        content?: {
                            'application/json': {
                                schema: {
                                    $ref?: string;
                                    type?: string;
                                    properties?: Record<string, any>;
                                };
                                example?: any;
                            };
                        };
                    };
                };
            };
        };
    };
    components?: {
        schemas?: {
            [key: string]: {
                type: string;
                properties?: Record<string, any>;
                required?: string[];
                title?: string;
                items?: {
                    $ref?: string;
                    type?: string;
                };
                example?: any;
            };
        };
    };
}

interface Endpoint {
    path: string;
    method: string;
    summary: string;
    description: string;
    parameters: Array<{
        name: string;
        in: string;
        required: boolean;
        type: string;
        description: string;
    }>;
    requestBody?: any;
    responses: Array<{
        status: string;
        description: string;
        schema?: any;
    }>;
}

const resolveSchema = (schema: any, spec: ApiSpec): any => {
    if (!schema) return null;
    
    if (schema.$ref) {
        const refPath = schema.$ref.split('/').slice(1);
        let resolvedSchema = spec;
        for (const part of refPath) {
            if (part === 'components') {
                resolvedSchema = (resolvedSchema as any).components;
            } else if (part === 'schemas') {
                resolvedSchema = (resolvedSchema as any).schemas;
            } else {
                resolvedSchema = (resolvedSchema as any)[part];
            }
        }
        return resolvedSchema;
    }
    
    if (schema.type === 'array' && schema.items?.$ref) {
        return {
            type: 'array',
            items: resolveSchema(schema.items, spec)
        };
    }
    
    if (schema.properties) {
        const resolvedProperties: Record<string, any> = {};
        for (const [key, value] of Object.entries(schema.properties)) {
            resolvedProperties[key] = resolveSchema(value, spec);
        }
        return {
            ...schema,
            properties: resolvedProperties
        };
    }
    
    return schema;
};

interface SchemaViewProps {
    schema: any;
    level?: number;
    spec: ApiSpec;
}

const SchemaView: React.FC<SchemaViewProps> = ({ schema, level = 0, spec }) => {
    if (!schema) return null;

    const renderProperty = (name: string, property: any, required: boolean = false) => {
        const isObject = property.type === 'object' || property.properties;
        const isArray = property.type === 'array';
        const isEnum = property.enum;
        const isRef = property.$ref;

        if (isRef) {
            const resolvedProperty = resolveSchema(property, spec);
            return renderProperty(name, resolvedProperty, required);
        }

        return (
            <div className="ml-4 border-l border-slate-600 pl-4">
                <div className="flex items-start gap-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-400">{name}</span>
                            {required && (
                                <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                                    required
                                </span>
                            )}
                            <span className="text-gray-400 text-sm">
                                {isArray ? 'array' : property.type || 'object'}
                                {property.format && ` (${property.format})`}
                            </span>
                        </div>
                        {property.description && (
                            <p className="text-gray-400 text-sm mt-1">{property.description}</p>
                        )}
                        {isEnum && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {property.enum.map((value: string) => (
                                    <span key={value} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                                        {value}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {isObject && property.properties && (
                    <div className="mt-2">
                        {Object.entries(property.properties).map(([propName, propValue]: [string, any]) => (
                            <div key={propName} className="mt-2">
                                {renderProperty(
                                    propName,
                                    propValue,
                                    property.required?.includes(propName)
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {isArray && property.items && (
                    <div className="mt-2">
                        {renderProperty('items', property.items)}
                    </div>
                )}
            </div>
        );
    };

    if (schema.$ref) {
        const resolvedSchema = resolveSchema(schema, spec);
        return <SchemaView schema={resolvedSchema} level={level} spec={spec} />;
    }

    const generateExample = (schema: any): any => {
        if (!schema) return null;

        if (schema.example) {
            return schema.example;
        }

        if (schema.type === 'array' && schema.items) {
            return [generateExample(schema.items)];
        }

        if (schema.type === 'object' && schema.properties) {
            const example: Record<string, any> = {};
            Object.entries(schema.properties).forEach(([key, value]: [string, any]) => {
                example[key] = generateExample(value);
            });
            return example;
        }

        if (schema.enum) {
            return schema.enum[0];
        }

        switch (schema.type) {
            case 'string':
                if (schema.format === 'uuid') {
                    return '3fa85f64-5717-4562-b3fc-2c963f66afa6';
                }
                if (schema.format === 'email') {
                    return 'user@example.com';
                }
                if (schema.format === 'date-time') {
                    return new Date().toISOString();
                }
                return 'string';
            case 'number':
            case 'integer':
                return 0;
            case 'boolean':
                return false;
            default:
                return null;
        }
    };

    const example = generateExample(schema);

    return (
        <div className="space-y-2">
            {schema.title && (
                <h4 className="text-lg font-semibold text-gray-200">{schema.title}</h4>
            )}
            {schema.description && (
                <p className="text-gray-400">{schema.description}</p>
            )}
            {schema.properties && (
                <div className="mt-4">
                    {Object.entries(schema.properties).map(([name, property]: [string, any]) => (
                        <div key={name} className="mt-2">
                            {renderProperty(
                                name,
                                property,
                                schema.required?.includes(name)
                            )}
                        </div>
                    ))}
                </div>
            )}
            {example && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Example</h4>
                    <pre className="bg-slate-800 rounded p-3 text-sm overflow-x-auto">
                        {JSON.stringify(example, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

const ApiDocs: React.FC = observer(() => {
    const [spec, setSpec] = useState<ApiSpec | null>(null);
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchApiSpec = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/openapi.json`);
                if (!response.ok) throw new Error('Failed to fetch API specification');
                
                const data = await response.json();
                setSpec(data);
                
                // Преобразуем спецификацию в удобный формат
                const formattedEndpoints: Endpoint[] = Object.entries(data.paths as Record<string, Record<string, any>>).flatMap(([path, methods]) => 
                    Object.entries(methods).map(([method, details]: [string, any]) => ({
                        path,
                        method: method.toUpperCase(),
                        summary: details.summary || '',
                        description: details.description || '',
                        parameters: details.parameters?.map((param: any) => ({
                            name: param.name,
                            in: param.in,
                            required: param.required || false,
                            type: param.schema?.type || 'string',
                            description: param.description || ''
                        })) || [],
                        requestBody: details.requestBody?.content?.['application/json']?.schema,
                        responses: Object.entries(details.responses || {}).map(([status, response]: [string, any]) => ({
                            status,
                            description: response.description || '',
                            schema: response.content?.['application/json']?.schema
                        }))
                    }))
                );
                
                setEndpoints(formattedEndpoints);
            } catch (error) {
                console.error('Error fetching API specification:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApiSpec();
    }, []);

    const filteredEndpoints = endpoints.filter(endpoint => 
        endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        endpoint.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">API Documentation</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search endpoints..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar with endpoints list */}
                    <div className="md:col-span-1">
                        <div className="bg-slate-800 rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-4">Endpoints</h2>
                            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                                {filteredEndpoints.map((endpoint, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedEndpoint(endpoint)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                                            selectedEndpoint?.path === endpoint.path && selectedEndpoint?.method === endpoint.method
                                                ? 'bg-blue-500 text-white'
                                                : 'hover:bg-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                                                endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                                                endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                                                endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                {endpoint.method}
                                            </span>
                                            <span className="truncate">{endpoint.path}</span>
                                        </div>
                                        {endpoint.summary && (
                                            <p className="text-sm text-gray-400 mt-1 truncate">{endpoint.summary}</p>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Endpoint details */}
                    <div className="md:col-span-2">
                        {selectedEndpoint ? (
                            <div className="bg-slate-800 rounded-lg p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                                        selectedEndpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                                        selectedEndpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                                        selectedEndpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                                        selectedEndpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                                        'bg-gray-500/20 text-gray-400'
                                    }`}>
                                        {selectedEndpoint.method}
                                    </span>
                                    <code className="text-lg font-mono">{selectedEndpoint.path}</code>
                                </div>

                                {selectedEndpoint.summary && (
                                    <p className="text-xl font-semibold mb-2">{selectedEndpoint.summary}</p>
                                )}
                                
                                {selectedEndpoint.description && (
                                    <p className="text-gray-300 mb-6">{selectedEndpoint.description}</p>
                                )}

                                {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Parameters</h3>
                                        <div className="space-y-2">
                                            {selectedEndpoint.parameters.map((param, index) => (
                                                <div key={index} className="bg-slate-700/50 rounded p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <code className="text-blue-400">{param.name}</code>
                                                        <span className="text-gray-400">({param.type})</span>
                                                        <span className="text-gray-400">in {param.in}</span>
                                                        {param.required && (
                                                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                                                                Required
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{param.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedEndpoint.requestBody && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Request Body</h3>
                                        <div className="bg-slate-700/50 rounded p-4">
                                            <SchemaView 
                                                schema={selectedEndpoint.requestBody} 
                                                spec={spec!} 
                                            />
                                        </div>
                                    </div>
                                )}

                                {selectedEndpoint.responses && selectedEndpoint.responses.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Responses</h3>
                                        <div className="space-y-4">
                                            {selectedEndpoint.responses.map((response, index) => (
                                                <div key={index} className="bg-slate-700/50 rounded p-4">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                            parseInt(response.status) >= 200 && parseInt(response.status) < 300
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : parseInt(response.status) >= 400
                                                                ? 'bg-red-500/20 text-red-400'
                                                                : 'bg-yellow-500/20 text-yellow-400'
                                                        }`}>
                                                            {response.status}
                                                        </span>
                                                        <p className="text-gray-300">{response.description}</p>
                                                    </div>
                                                    
                                                    {response.schema && (
                                                        <>
                                                            <SchemaView 
                                                                schema={response.schema} 
                                                                spec={spec!} 
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedEndpoint.path.includes('/trades') && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-3">Enums</h3>
                                        <div className="space-y-4">
                                            <div className="bg-slate-700/50 rounded p-3">
                                                <h4 className="text-sm font-medium text-gray-300 mb-2">Currency</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {['BTC', 'MATIC', 'USDT'].map((currency) => (
                                                        <span key={currency} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                                            {currency}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-slate-700/50 rounded p-3">
                                                <h4 className="text-sm font-medium text-gray-300 mb-2">Status (hide)</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Create', 'Pending', 'Successful', 'Appilation', 'Error'].map((status) => (
                                                        <span key={status} className={`px-2 py-1 rounded text-xs ${
                                                            status === 'Create' ? 'bg-blue-500/20 text-blue-400' :
                                                            status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            status === 'Successful' ? 'bg-green-500/20 text-green-400' :
                                                            status === 'Appilation' ? 'bg-purple-500/20 text-purple-400' :
                                                            'bg-red-500/20 text-red-400'
                                                        }`}>
                                                            {status}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-slate-800 rounded-lg p-6 text-center text-gray-400">
                                Select an endpoint to view its details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ApiDocs; 