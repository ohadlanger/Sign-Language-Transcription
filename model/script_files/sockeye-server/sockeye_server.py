import socket
import subprocess
import os

def run_server():
    # Choose a port number
    port = 5555
    
    # Create a TCP/IP socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    # Set socket options to reuse address
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    # Bind the socket to the address and port
    try:
        server_socket.bind(('0.0.0.0', port))
    except socket.error as e:
        print(f"Socket error during bind: {e}")
        return
    
    # Start listening for connections
    server_socket.listen(1)
    print(f"Server running on port {port}")
    
    while True:
        try:
            # Wait for a connection
            connection, client_address = server_socket.accept()
            print(f"Connection from {client_address}")
            
            try:
                # Receive data from the client
                data = connection.recv(1024).decode('utf-8')
                
                if data:
                    # Save the data to input_file.txt
                    with open('input_file.txt', 'w') as file:
                        file.write(data)
                    
                    # Run the Sockeye translation command
                    result = subprocess.run(
                        ['python3', '-m', 'sockeye.translate', '-m', 'sockeye-signwriting-to-text', 
                         '--input', 'input_file.txt', '--output', 'output_bpe.txt', '--nbest-size=5'],
                        capture_output=True, text=True
                    )
                    
                    # Check for errors in the translation process
                    if result.returncode != 0:
                        connection.sendall(f"Error during translation: {result.stderr}".encode('utf-8'))
                    else:
                        # Read the output from output_bpe.txt
                        with open('output_bpe.txt', 'r') as file:
                            response = file.read()
                        
                        # Send the result back to the client
                        connection.sendall(response.encode('utf-8'))
            
            finally:
                # Clean up the connection
                connection.close()
        
        except socket.error as e:
            print(f"Socket error: {e}")

if __name__ == "__main__":
    run_server()
