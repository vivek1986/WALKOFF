import subprocess

import click


@click.command()
@click.pass_context
def status(ctx):
    """
    Retrieves status of WALKOFF inside Kubernetes cluster.

    WIP - currently an alias for kubectl get pods
    """
    subprocess.call(['kubectl', 'get', 'pods'])


def kube_status():
    click.echo('Getting walkoff status from kubectl')
    subprocess.call(['kubectl', 'get', 'pods'])

    # pods = client.list_pod_for_all_namespaces(watch=False)
    # for pod in pods.items:
    #     pod_name = pod.metadata.name
    #     for container in pod.status.container_statuses:
    #         container_name = container.name
    #         status = _state_summary(container.state)

# def _state_summary(state):
#     for possible_state in ('running', 'terminated', 'waiting'):
#         if getattr(state, possible_state, None) is not None:
#             in_state = getattr(state, possible_state)
#             return possible_state, in_state.reason, in_state.message
#     else:
#         return None, None, None
