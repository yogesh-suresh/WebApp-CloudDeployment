# Create CloudFormation Stack
echo "Please enter CICD Stack Name:"
read cicdStackName
if [ -z "$cicdStackName" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$cicdStackName"


#Codedeploy ApplicationName
echo "Please enter Codedeploy application Name:"
read codedeployAppName
if [ -z "$codedeployAppName" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$codedeployAppName"

#Domain name of namecheap
echo "Please enter Domain name of namecheap for S3Bucket Name:"
read domainname
if [ -z "$domainname" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$domainname"

#S3 bucket name for lambda
echo "Please enter S3 Bucket name for Lambda:"
read s3lambda
if [ -z "$s3lambda" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$s3lambda"

#AWS Region for Travis-Code-Deploy
echo "Please enter AWS Region for Travis-Code-Deploy policy:"
read awsregion
if [ -z "$awsregion" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$awsregion"

echo "Validating template"
TMP_code=`aws cloudformation validate-template --template-body file://./csye6225-cf-cicd.json`
if [ -z "$TMP_code" ]
then
	echo "Template error exiting!"
	exit 1
fi
echo "Cloudformation template validation success"

echo "Creating CICD CloudFormation Stack"

CRTSTACK_Code=`aws cloudformation create-stack --stack-name $cicdStackName --template-body file://./csye6225-cf-cicd.json --parameters ParameterKey=CICDStackNameParameter,ParameterValue=$cicdStackName ParameterKey=DomainNameParameter,ParameterValue=$domainname ParameterKey=AWSRegionParameter,ParameterValue=$awsregion ParameterKey=CodedeployAppNameParameter,ParameterValue=$codedeployAppName ParameterKey=LambdaS3BucketParameter,ParameterValue=$s3lambda --capabilities CAPABILITY_NAMED_IAM`
if [ -z "$CRTSTACK_Code" ]
then
	echo "Stack Creation error exiting!"
	exit 1
fi
aws cloudformation wait stack-create-complete --stack-name $cicdStackName
echo "CICD Stack Created"
echo "Check AWS Cloudformation"
