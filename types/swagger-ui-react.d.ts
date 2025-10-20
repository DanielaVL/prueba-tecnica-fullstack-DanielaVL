declare module 'swagger-ui-react' {
  interface SwaggerUIProps {
    spec: any;
  }
  
  const SwaggerUI: React.FC<SwaggerUIProps>;
  export default SwaggerUI;
}