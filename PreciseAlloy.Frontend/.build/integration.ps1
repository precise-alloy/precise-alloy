Write-Output "Script is running"

function Get-ExistingOrNewPullRequest {
  param(
    [Parameter(Mandatory = $true)] [String]$sourceBranch,
    [Parameter(Mandatory = $true)] [String]$targetBranch,
    [Parameter(Mandatory = $true)] [String]$projectUrl,
    [Parameter(Mandatory = $true)] [String]$reviewerId,
    [Parameter(Mandatory = $true)] $headers
  )

  $requestUrl = '{0}/pullRequests' -f $projectUrl
  $requestUrl = '{0}?searchCriteria.sourceRefName=refs/heads/{1}' -f $requestUrl, $sourceBranch
  $requestUrl = '{0}&searchCriteria.targetRefName=refs/heads/{1}' -f $requestUrl, $targetBranch
  $requestUrl = '{0}&searchCriteria.status=active' -f $requestUrl
  $requestUrl = '{0}&$top=1' -f $requestUrl
  $requestUrl = '{0}&api-version=6.0' -f $requestUrl

  Write-Output "Sending a REST call to get existing pull request from $sourceBranch to $targetBranch"

  $responseData = Invoke-RestMethod `
    -Method GET `
    -Headers $headers `
    -Uri $requestUrl

  if ($responseData -and $responseData.value -and $responseData.value.pullRequestId) {
    $pullRequestId = $responseData.value.pullRequestId

    Write-Output "Pull request existed. Pull Request Id: $pullRequestId"
    return $pullRequestId
  }
  else {
    Write-Output "Pull request is not exists!"
    
    New-PullRequest `
      -sourceBranch $sourceBranch `
      -targetBranch $targetBranch `
      -projectUrl $projectUrl `
      -reviewerId $reviewerId `
      -setAutoComplete `
      -headers $headers
  }
}

function New-PullRequest {
  param(
    [Parameter(Mandatory = $true)] [String]$sourceBranch,
    [Parameter(Mandatory = $true)] [String]$targetBranch,
    [Parameter(Mandatory = $true)] [String]$projectUrl,
    [Parameter(Mandatory = $true)] [String]$reviewerId,
    [Parameter()] [Switch]$setAutoComplete,
    [Parameter(Mandatory = $true)] $headers
  )

  $requestUrl = '{0}/pullrequests?api-version=6.0' -f $projectUrl
  $requestData = @{
    "sourceRefName" = "refs/heads/$sourceBranch"
    "targetRefName" = "refs/heads/$targetBranch"
    "title"         = "Pull from $sourceBranch to $targetBranch"
    "description"   = ""
    "reviewers"     = @(
      @{
        "id" = $reviewerId
      }
    )
  }

  $requestData = $requestData | ConvertTo-Json -Depth 5

  Write-Output "Sending a REST call to create a new pull request from $sourceBranch to $targetBranch"

  $responseData = Invoke-RestMethod `
    -Method POST `
    -Headers $headers `
    -Body $requestData `
    -Uri $requestUrl

  $pullRequestId = $responseData.pullRequestId
  $pullRequestCreatorId = $responseData.createdBy.id

  Write-Output "Pull request created. Pull Request Id: $pullRequestId. Pull request creator Id: $pullRequestCreatorId"
  
  if ($setAutoComplete) {
    Set-AutoComplete `
      -projectUrl $projectUrl `
      -pullRequestId $pullRequestId `
      -autoCompleteSetBy $pullRequestCreatorId `
      -headers $headers
  }
}

function Set-AutoComplete {
  param(
    [Parameter(Mandatory = $true)] [String]$projectUrl,
    [Parameter(Mandatory = $true)] [String]$pullRequestId,
    [Parameter(Mandatory = $true)] [String]$autoCompleteSetBy,
    [Parameter(Mandatory = $true)] $headers
  )

  $requestUrl = '{0}/pullRequests/{1}?api-version=6.0' -f $projectUrl, $pullRequestId
  $requestData = @{
    "autoCompleteSetBy" = @{
      "id" = $autoCompleteSetBy
    }
    "completionOptions" = @{     
      "deleteSourceBranch" = $false
      "bypassPolicy"       = $false
    }
  }

  $requestData = $requestData | ConvertTo-Json -Depth 5

  Write-Output "Sending a REST call to set auto-complete on the newly created pull request"

  Invoke-RestMethod `
    -Method PATCH `
    -Headers $headers `
    -Body $requestData `
    -Uri $requestUrl | Out-Null

  Write-Output "Pull request set to auto-complete"
}

function Request-PullToBaseBranch {
  $repositoryName = $env:CUSTOM_REPOSITORY_NAME
  $sourceBranch = $env:CUSTOM_SOURCE_BRANCH
  $targetBranch = $env:CUSTOM_TARGET_BRANCH
  $reviewerId = $env:CUSTOM_REVIEWER_ID
  $accessToken = $env:SYSTEM_ACCESSTOKEN

  Write-Host "repositoryName: '$repositoryName'" -ForegroundColor DarkYellow
  Write-Host "sourceBranch: '$sourceBranch'" -ForegroundColor DarkYellow
  Write-Host "targetBranch: '$targetBranch'" -ForegroundColor DarkYellow
  Write-Host "reviewerId: '$reviewerId'" -ForegroundColor DarkYellow

  # construct base URLs
  $apisUrl = "{0}/{1}/_apis" -f $env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI, $env:SYSTEM_TEAMPROJECT
  $projectUrl = "{0}/git/repositories/{1}" -f $apisUrl, $repositoryName

  # create common headers
  $headers = @{}
  $headers.Add("Authorization", "Bearer $accessToken")
  $headers.Add("Content-Type", "application/json")

  Get-ExistingOrNewPullRequest `
    -sourceBranch $sourceBranch `
    -targetBranch $targetBranch `
    -projectUrl $projectUrl `
    -reviewerId $reviewerId `
    -headers $headers
}

Request-PullToBaseBranch
