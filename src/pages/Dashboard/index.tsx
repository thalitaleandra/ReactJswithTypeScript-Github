import React, { useState, FormEvent, useEffect } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import logoImg from '../../assets/Logo.svg'
import { Title, Form, Repositories, Error } from './styles'
import { Link } from 'react-router-dom';
import api from '../../services/api'


interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}


const Dashboard: React.FC = () => {
    const [inputError, setInputError] = useState('')
    const [newRepo, setNewRepo] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@GithubExplore: repositories')
        if (storagedRepositories) {
            return JSON.parse(storagedRepositories)
        } else {
            return [];
        }

    });

    useEffect(() => {
        localStorage.setItem('@GithubExplore: repositories', JSON.stringify(repositories))
    }, [repositories])
    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        //console.log(newRepo)
        // adicao de um novo repositorio
        if (!newRepo) {
            setInputError('Digite autor/nome do repo.')
            return;
        }
        try {
            const response = await api.get<Repository>(`repos/${newRepo}`)
            //  console.log(response.data); // dados da api

            const repository = response.data;
            setRepositories([...repositories, repository])
            setNewRepo('');
            setInputError('');
        } catch (err) {
            setInputError('Erro na busca pelo repositório.')
        }

    }
    return (
        <>
            <img src={logoImg} alt="Github Explorer" />
            <Title>Explore repositórios no GitHub</Title>
            <Form hasError={!!inputError} onSubmit={handleAddRepository} >
                <input
                    value={newRepo}
                    onChange={e => setNewRepo(e.target.value)}
                    placeholder="Digite o nome do repositório"
                />
                <button type="submit">Pesquisar</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}
            <Repositories>

                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    )
}


export default Dashboard;