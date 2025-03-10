import { Router } from 'express';
import { run } from '../utils/dockerUtils';
import { generate } from 'random-words';
import { isValidGitCloneUrl } from '../utils/gitUtils';
import { prisma } from '../utils/prisma';

const router = Router();

router.post('/deploy', async (req, res) => {
    const { repoUrl } = req.body;


    // Check if repoUrl is provided
    if (!repoUrl) {
        res.status(400).json({
            message: 'repoUrl is required!',
        });
        return;
    }
    
    // Validate the provided repoUrl
    if (!isValidGitCloneUrl(repoUrl)) {
        res.status(400).json({
            message: 'The provided URL is invalid!',
        });
        return;
    }

    const ifRepoExists = await prisma.hostedRepositories.findUnique({
        where: {
            url: repoUrl
        }
    });
    if(ifRepoExists) {
        res.status(301).json({
            message: "repository exists in database"
        })
        return;
    }

    // Generate a random ID
    const id = generate({ exactly: 3, join: '-' });
    console.log(id);

    try {
        // store url and name in db
        await prisma.hostedRepositories.create({
            data: {
                url: repoUrl,
                name: id
            }
        });
        // Run the deployment process
        await run(repoUrl, id);
        res.status(200).json({ id });
        return;
    } catch (error) {
        console.error('Error during deployment:', error);
        res.status(500).json({
            message: 'An error occurred during the deployment process!',
        });
        return;
    }
});

export default router;
